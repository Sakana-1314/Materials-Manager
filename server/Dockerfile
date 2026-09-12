# 构建上下文为 server/ 目录本身（CI: context=./server），因此 COPY 路径不含 server/ 前缀。
FROM python:3.12-slim

ARG BUILD_TIME
ARG GIT_SHA
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 \
    APP_BUILD_TIME=$BUILD_TIME \
    APP_GIT_SHA=$GIT_SHA
WORKDIR /app
COPY pyproject.toml ./
COPY app ./app
RUN pip install --no-cache-dir .
RUN mkdir -p /app/data/uploads /app/data/logs
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
