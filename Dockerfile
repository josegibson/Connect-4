FROM python:3.10-slim

WORKDIR /

COPY backend/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/. .

EXPOSE 5000

CMD ["python", "app.py"]