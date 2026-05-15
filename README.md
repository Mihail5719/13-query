# ДЗ 13: Query String Builder

## 👤 Автор
**Iosif Goff** | PurpleSchool | 15.05.2026

---

## 📋 Описание задания
Написать функцию, которая принимает объект с параметрами и возвращает строку запроса (query string) формата `key1=value1&key2=value2` для использования в URL.

**Пример:**
```javascript
Input:  { search: 'Вася', take: 10 }
Output: "search=Вася&take=10"