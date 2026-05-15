/**
 * ДЗ 13: Построение строки запроса (Query String Builder)
 * Студент: Iosif Goff | PurpleSchool
 * Дата: 2026-05-15
 *
 * Задача: Написать функцию, которая принимает объект с параметрами
 * и возвращает строку формата "key1=value1&key2=value2" для вставки в URL.
 */

/**
 * Преобразует объект параметров в query-строку
 * @param {Object} params - Объект с параметрами запроса
 * @param {boolean} [encode=false] - Кодировать ли значения через encodeURIComponent
 * @returns {string} Строка запроса вида "key1=value1&key2=value2"
 *
 * @example
 * buildQueryString({ search: 'Вася', take: 10 })
 * // => "search=Вася&take=10"
 *
 * @example
 * buildQueryString({ q: 'a&b', page: 1 }, true)
 * // => "q=a%26b&page=1"
 */
function buildQueryString(params, encode = false) {
  // Валидация: если не объект или null — возвращаем пустую строку
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    return '';
  }

  return (
    Object.entries(params)
      // Фильтруем null и undefined значения (но оставляем 0, false, '')
      .filter(([_, value]) => value != null)

      // Преобразуем каждую пару [ключ, значение] в строку "key=value"
      .map(([key, value]) => {
        // При необходимости кодируем ключ и значение
        const k = encode ? encodeURIComponent(key) : String(key);
        const v = encode ? encodeURIComponent(value) : String(value);
        return `${k}=${v}`;
      })

      // Склеиваем все пары через '&'
      .join('&')
  );
}

// ============================================================
// ИНТЕРАКТИВНАЯ ЧАСТЬ (для HTML-интерфейса)
// ============================================================

/**
 * Основная функция обработки кнопки "Построить строку"
 */
function runBuild() {
  const jsonInput = document.getElementById('jsonInput');
  const encodeToggle = document.getElementById('encodeToggle');
  const output = document.getElementById('output');
  const urlPreview = document.getElementById('urlPreview');

  const jsonText = jsonInput.value.trim();
  const encode = encodeToggle.checked;

  // Сброс стилей
  output.className = 'output-box';
  urlPreview.querySelector('.placeholder')?.classList.remove('placeholder');

  // Валидация: пустой ввод
  if (!jsonText) {
    output.textContent = '⚠️ Введите объект в формате JSON';
    output.className = 'output-box warning';
    urlPreview.innerHTML =
      'https://example.com/api?<span class="placeholder">...</span>';
    return;
  }

  // Попытка распарсить JSON
  let params;
  try {
    params = JSON.parse(jsonText);
  } catch (error) {
    output.textContent = `❌ Ошибка JSON: ${error.message}`;
    output.className = 'output-box error';
    return;
  }

  // Проверка, что это объект, а не массив или примитив
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    output.textContent = '❌ Ожидается объект в формате { key: value }';
    output.className = 'output-box error';
    return;
  }

  // Вызов основной функции
  const result = buildQueryString(params, encode);

  // Отображение результата
  if (result) {
    output.textContent = result;
    output.className = 'output-box success';
    urlPreview.innerHTML = `https://example.com/api?<strong>${escapeHtml(result)}</strong>`;

    // Лог в консоль для отладки
    console.log(`✅ Query built: ${result}`);
  } else {
    output.textContent = 'ℹ️ Пустой результат (нет валидных параметров)';
    output.className = 'output-box warning';
    urlPreview.innerHTML =
      'https://example.com/api?<span class="placeholder">...</span>';
  }
}

/**
 * Копирует результат в буфер обмена
 */
function copyResult() {
  const output = document.getElementById('output');
  const text = output.textContent;

  // Не копируем, если это сообщение об ошибке или подсказка
  if (
    !text ||
    text.startsWith('⚠️') ||
    text.startsWith('❌') ||
    text.startsWith('ℹ️') ||
    text.startsWith('Нажмите')
  ) {
    showToast('⚠️ Нет результата для копирования', 'warning');
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      output.classList.add('copied');
      showToast('✅ Скопировано в буфер обмена!', 'success');

      // Убираем анимацию через 300мс
      setTimeout(() => output.classList.remove('copied'), 300);
    })
    .catch(() => {
      showToast('❌ Не удалось скопировать', 'error');
    });
}

/**
 * Очищает все поля
 */
function clearAll() {
  document.getElementById('jsonInput').value = '{"search": "Вася", "take": 10}';
  document.getElementById('encodeToggle').checked = false;

  const output = document.getElementById('output');
  output.textContent = 'Нажмите «Построить строку» для проверки';
  output.className = 'output-box';

  const urlPreview = document.getElementById('urlPreview');
  urlPreview.innerHTML =
    'https://example.com/api?<span class="placeholder">...</span>';

  showToast('🗑️ Поля очищены', 'info');
}

/**
 * Показывает временное уведомление
 * @param {string} message - Текст сообщения
 * @param {'success'|'error'|'warning'|'info'} type - Тип уведомления
 */
function showToast(message, type = 'info') {
  // Создаём элемент, если его нет
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);

    // Добавляем анимацию в стиль
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Настраиваем цвета по типу
  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };
  toast.style.background = colors[type] || colors.info;
  toast.textContent = message;

  // Показываем и скрываем через таймер
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => (toast.style.display = 'none'), 300);
  }, 2000);
}

/**
 * Экранирует HTML-символы для безопасной вставки в DOM
 * @param {string} str - Исходная строка
 * @returns {string} Экранированная строка
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ (для расширения функционала)
// ============================================================

/**
 * Расширенная версия: поддержка массивов и вложенных объектов
 * @param {Object} params - Объект с параметрами
 * @param {Object} options - Настройки: { encode, arrayFormat, nestedFormat }
 * @returns {string} Строка запроса
 */
function buildQueryStringAdvanced(params, options = {}) {
  const {
    encode = false,
    arrayFormat = 'repeat', // 'repeat' | 'brackets' | 'comma'
    nestedFormat = 'brackets', // 'brackets' | 'dot'
  } = options;

  const result = [];

  function processValue(key, value, prefix = '') {
    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (value === null || value === undefined) {
      return; // Пропускаем
    }

    if (Array.isArray(value)) {
      // Обработка массивов
      if (arrayFormat === 'comma') {
        const encoded = value
          .map((v) => (encode ? encodeURIComponent(v) : v))
          .join(',');
        result.push(
          `${encode ? encodeURIComponent(fullKey) : fullKey}=${encoded}`,
        );
      } else {
        value.forEach((item) => {
          if (arrayFormat === 'brackets') {
            result.push(
              `${encode ? encodeURIComponent(`${fullKey}[]`) : `${fullKey}[]`}=${encode ? encodeURIComponent(item) : item}`,
            );
          } else {
            // repeat (по умолчанию)
            result.push(
              `${encode ? encodeURIComponent(fullKey) : fullKey}=${encode ? encodeURIComponent(item) : item}`,
            );
          }
        });
      }
    } else if (typeof value === 'object') {
      // Рекурсивная обработка вложенных объектов
      Object.entries(value).forEach(([k, v]) => {
        processValue(k, v, fullKey);
      });
    } else {
      // Простое значение
      const k = encode ? encodeURIComponent(fullKey) : fullKey;
      const v = encode ? encodeURIComponent(value) : String(value);
      result.push(`${k}=${v}`);
    }
  }

  Object.entries(params).forEach(([key, value]) => {
    processValue(key, value);
  });

  return result.join('&');
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ: обработчики событий после загрузки DOM
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Поддержка Enter в textarea для запуска (Ctrl+Enter)
  const jsonInput = document.getElementById('jsonInput');
  jsonInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      runBuild();
    }
  });

  // Авто-запуск при загрузке с дефолтными данными
  console.log('🚀 ДЗ 13: Query String Builder загружен');
  console.log('💡 Подсказка: используйте Ctrl+Enter для быстрого запуска');
});

// ============================================================
// ЭКСПОРТ (для использования в Node.js / тестах)
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildQueryString, buildQueryStringAdvanced };
}
