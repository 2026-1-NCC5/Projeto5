class EmailService:
    @staticmethod
    def enviar_link_convite(email_destino: str, nome_aluno: str, token: str):
        """
        Simula ou envia o e-mail com o link de convite.
        """
        link = f"https://scancount.app/registro?token={token}"
        
        # Template do corpo do e-mail
        corpo_email = f"""
        Olá {nome_aluno},
        
        Você foi convidado para participar do projeto ScanCount AI na FECAP!
        Para concluir seu vínculo, acesse o link abaixo:
        
        {link}
        
        Caso já possua conta, basta fazer o login e o vínculo será automático.
        """
        
        # No futuro, aqui entra a lógica de smtplib.sendmail()
        print("\n" + "="*30)
        print(f"📧 E-MAIL ENVIADO PARA: {email_destino}")
        print(f"ASSUNTO: Convite ScanCount AI")
        print(corpo_email)
        print("="*30 + "\n")
        
        return True