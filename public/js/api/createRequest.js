/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const {
    url = '',
    method = 'GET',
    data = {},
    responseType = 'json',
    callback = () => {}
  } = options;

  if (!url) {
    callback(new Error('Для запроса требуется URL-адрес'));
    return;
  }

  const xhr = new XMLHttpRequest();
  const safeMethod = method.toUpperCase();
  let requestUrl = url;
  let body = null;

  if (safeMethod === 'GET' && data && Object.keys(data).length) {
    const query = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    requestUrl += requestUrl.includes('?') ? `&${query}` : `?${query}`;
  } else if (data && safeMethod !== 'GET') {
    body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      body.append(key, value);
    });
  }

  xhr.responseType = responseType;

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 400) {
      callback(null, xhr.response);
    } else {
      const error = new Error(`Запрос не выполнен со статусом ${xhr.status}`);
      error.status = xhr.status;
      callback(error, xhr.response);
    }
  });

  xhr.addEventListener('error', () => {
    callback(new Error('Ошибка сети'));
  });

  try {
    xhr.open(safeMethod, requestUrl);
    xhr.send(body);
  } catch (error) {
    callback(error);
  }
};
