window.onload = function() {
    var menuBtn = document.querySelector('.navigation__btn');
    var btnGo = document.querySelectorAll('.go');
    var modal = document.querySelector('.modal');
    var openModal = document.querySelector('a[data-more]');
    var closeModal = document.querySelector('.modal button')

    openModal.onclick = function() {
        modal.classList.add('modal--active')
        return false;
    }

    closeModal.onclick = function() {
        modal.classList.remove('modal--active')
    };

    menuBtn.onclick = function() {
        var menu = document.querySelector('.navigation');
        var menuItem = document.querySelector('.navigation__item');

        toggleClass(menu, 'navigation--active');
        toggleClass(menuItem, 'navigation__item--active');
    }


    for (let i = 0; i < btnGo.length; i++) {
        btnGo[i].onclick = function() {
            var context = this;
            toggleClass(context, 'run');
            return false;
        }
    }

    function toggleClass(element, toggleClass) {
        element.classList.toggle(toggleClass);
    }
};

$('.owl-carousel').owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    items: 1
})