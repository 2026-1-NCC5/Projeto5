from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DATABASE_URL: str
    SECRET_KEY: str = "SUA_CHAVE_SUPER_SECRETA_DA_FECAP"
    ALGORITHM: str = "HS256"

    # Isso faz o Pydantic ler o arquivo .env automaticamente
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()