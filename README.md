# DRONE SPACE BAR
Рабочая версия: https://drone-space-bar.herokuapp.com   

## Архитектура системы

### Файловая структура проекта  

* **node_modules** - системные компоненты  
* **tests** - тесты  
* **src** - файлы приложения  
   * **css** - файлы стилей (используется Materialize)
   * **fonts** - шрифты Materialize
   * **js** - библиотеки (jQuery, Materialize, socket.io)
   * **Kitchen, Login, MyTable, Menu, Service** - модули и компоненты приложения
   * **DroneCafeApp.js** - файл приложения, роутинг
* **index.html** - точка входа
* **server.js** - сервер (express, socket.io)

### Модули

Модуль  | Описание             | Функции
-------------------------------------------
Login   | Модуль авторизации   | Осуществляет авторизацию / регистрацию пользователя в системе, создает / модифицирует cookies
Menu 	| Компонент меню	   | Интерактивный список блюд для заказа, входит в модуль MyTable
MyTable	| Виртуальный столик клиента | Интерфейс пользователя, где можно сделать заказ, пополнить счет и следить за состоянием заказов
Kitchen | Модуль Кухня 		   | Интерфейс повара для управления заказами