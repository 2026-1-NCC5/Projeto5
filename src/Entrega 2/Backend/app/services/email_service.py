from app.core.logger import logger

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
        logger.info("\n" + "="*30)
        logger.info(f"📧 E-MAIL ENVIADO PARA: {email_destino}")
        logger.info(f"ASSUNTO: Convite ScanCount AI")
        logger.info(corpo_email)
        logger.info("="*30 + "\n")
        
        return True