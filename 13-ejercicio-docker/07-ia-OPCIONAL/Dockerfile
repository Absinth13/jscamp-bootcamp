FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Es mejor copiar solo el código de la app, asi evitamos incluir archivos innecesarios en la imagen
COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]