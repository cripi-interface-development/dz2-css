# Домашнее задание №2

Мною был выбран элемент из примера: картинка «Бухгалтерия Онлайн» с сайта СКБ-Контура. Выбрал его, чтобы можно было посоревноваться на длинный и короткий селекторы — наверняка не я один буду его рассматривать :)

## Самый длинный селектор

* `html[xmlns="http://www.w3.org/1999/xhtml"] > head + body > div.main > div.head-block + div.menu-and-search + div.index > div.left-part- > div.b-slides.image-rounder-white + script[type="text/javascript"] + div.concepts.concepts__main + div.ad + div.left-part > div.left-col- + div.right-col- > div.news.fresh-news + div.buhonline-block > a[href="http://www.buhonline.ru"][target="_blank"] > img[src="/theme/ver-1603233632/images/buhonline-logo.gif"][alt="Бухгалтерия Онлайн"][title="Бухгалтерия Онлайн"]`

## Самый короткий селектор

* `img[alt$=н]`

## Так же уникальны:

*   `div + div > div + div > a > img`
*   `.buhonline-block img`
*   `.right-col- img`
*   `.right-col- a img`
*   `.right-col- a > img`
*	…

Остальные приходящие на ум селекторы либо повторяют части самого длинного селектора, либо используют уже продемонстрированные подходы (такие как: исползование контекстных селекторов, соседних/дочерних  селекторов и селекторов атрибутов).

## Фан

Ради фана [сделал страничку](http://axlerk.com/lab/cripi/wd-dz02/ "длинный селектор") демонстрирующую "путь" длинного селектора.