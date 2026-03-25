import os
import time
import requests
import urllib3
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Suprime os avisos de InsecureRequestWarning devido ao verify=False (SSL via rede da universidade)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def configurar_driver():
    """Configura o driver do Chrome com as opções necessárias para scraping."""
    chrome_options = Options()
    
    # Ignora erros de certificado SSL sugeridos pelas restrições de rede
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--ignore-ssl-errors')
    
    # Otimizações para melhorar a estabilidade e performance
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    
    # Simula um user-agent de um navegador real
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                                'AppleWebKit/537.36 (KHTML, like Gecko) '
                                'Chrome/114.0.0.0 Safari/537.36')
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.maximize_window()
    return driver

def descer_paginas(driver, meta_fotos):
    """Realiza scrolls contínuos na página para carregar as fotos."""
    last_height = driver.execute_script("return document.body.scrollHeight")
    
    while True:
        # Desce a página até o fim
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        # Delay conservador exigido para evitar bloqueios do bot target:
        time.sleep(2.5) 
        
        try:
            # Se o botão de "Mostrar mais" ou similar aparecer, clica nele
            btn_mostrar_mais = driver.find_element(By.CSS_SELECTOR, ".mye4qd")
            if btn_mostrar_mais.is_displayed():
                driver.execute_script("arguments[0].click();", btn_mostrar_mais)
                time.sleep(2.5)
        except:
            pass
            
        new_height = driver.execute_script("return document.body.scrollHeight")
        
        # Pega as miniaturas na DOM atual
        miniaturas = driver.find_elements(By.CSS_SELECTOR, "img.rg_i, img.YQ4gaf, img.Q4LuWd")
        
        # Parar de rolar se já carregamos a quantidade pedida (com sobra)
        if len(miniaturas) > (meta_fotos + 50):
            break
            
        # Parar de rolar se não dá pra carregar mais
        if new_height == last_height:
            break
            
        last_height = new_height

    return driver.find_elements(By.CSS_SELECTOR, "img.rg_i, img.YQ4gaf, img.Q4LuWd")

def coletar_imagens(termos_busca, total_fotos_por_termo=500):
    driver = configurar_driver()
    
    for termo in termos_busca:
        print(f"\n--- Iniciando coleta para: '{termo}' ---")
        pasta = termo.replace(" ", "_").lower()
        if not os.path.exists(pasta):
            os.makedirs(pasta)
        
        url = f"https://www.google.com/search?q={termo}&tbm=isch"
        driver.get(url)
        
        print(f"[{termo}] Aguardando a página (se houver teste de humanidade/Captcha, resolva-o agora na janela aberta)...")
        try:
            # Pausa o script por até 120 segundos até que as imagens carreguem (usuário passou no captcha)
            WebDriverWait(driver, 120).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "img.rg_i, img.YQ4gaf, img.Q4LuWd"))
            )
        except Exception as e:
            print(f"[{termo}] Tempo limite aguardando o Captcha/Página. Pulando para o próximo.")
            continue
            
        print(f"[{termo}] Carregando miniaturas (scroll). Isso pode demorar, aguarde...")
        thumbnails = descer_paginas(driver, total_fotos_por_termo)
        print(f"[{termo}] Encontradas {len(thumbnails)} imagens base na página.")
        
        urls_baixadas = set()
        contagem = 0
        
        import base64
        
        for i in range(len(thumbnails)):
            if contagem >= total_fotos_por_termo:
                break
                
            try:
                # Resgata a miniatura na DOM para evitar StaleElementReferenceException e pega diretamente a URL dela
                miniaturas_atuais = driver.find_elements(By.CSS_SELECTOR, "img.rg_i, img.YQ4gaf, img.Q4LuWd")
                if i >= len(miniaturas_atuais):
                    break
                    
                img_miniatura = miniaturas_atuais[i]
                
                # Ignorar as logos pequenas dos sites da busca (favicons e ícones geralmente têm < 50 pixels)
                size = img_miniatura.size
                if size['width'] < 80 or size['height'] < 80:
                    continue
                
                src = img_miniatura.get_attribute('src')
                
                if not src:
                    # Parte do lazy-load do Google guarda a URL no 'data-src' se você ainda não scrollou passando por ele
                    src = img_miniatura.get_attribute('data-src')
                    
                if not src or src in urls_baixadas:
                    continue
                    
                urls_baixadas.add(src)
                caminho_img = os.path.join(pasta, f"img_{contagem+1:04d}.jpg")
                
                # Duas formas de salvar a imagem da miniatura (o exato 'Guardar imagem como'):
                if src.startswith('data:image'):
                    # O Google injeta algumas das primeiras fotos em Base64 puros na própria página HTML
                    try:
                        formato, img_string = src.split(',', 1)
                        img_data = base64.b64decode(img_string)
                        with open(caminho_img, 'wb') as f:
                            f.write(img_data)
                        contagem += 1
                        print(f"[{termo}] Sucesso (Base64)! Baixada {contagem}/{total_fotos_por_termo}")
                    except:
                        pass
                    
                elif src.startswith('http'):
                    headers = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
                    }
                    response = requests.get(src, timeout=10, verify=False, headers=headers)
                    if response.status_code == 200:
                        with open(caminho_img, 'wb') as f:
                            f.write(response.content)
                        contagem += 1
                        print(f"[{termo}] Sucesso (HTTP)! Baixada {contagem}/{total_fotos_por_termo}")
                        
            except Exception as e:
                print(f"[{termo}] Erro ao baixar miniatura {i}: {type(e).__name__}")
                continue

    driver.quit()
    print("\n[+] Coleta concluída para todos os termos do dataset de YOLO!")

if __name__ == "__main__":
    lista_de_categorias = [
    "arroz tio joão",
    "arroz camil",
    "arroz prato fino",
    "arroz no supermercado",
    "arroz na prateleira",
    "feijão camil",
    "feijão kikaldo",
    "feijão no supermercado",
    "pacote de feijão na prateleira",
    "oleo de cozinha soya",
    "oleo de cozinha liza",
    "oleo de cozinha nas prateleiras de supermercado"
    ]
    
    # Executa a automação buscando as 500 fotos
    coletar_imagens(lista_de_categorias, total_fotos_por_termo=50)