import cookies from 'js-cookie';

export default class NavigationController {
    constructor() {
        this.bindListeners();
    }

    bindListeners() {
        document.getElementById('en').addEventListener("click", e => this.changeLang('en'), true);
        document.getElementById('fr').addEventListener("click", e => this.changeLang('fr'), true);
        window.addEventListener('user_updated', (e) => {
            let user = e.detail;
            window.config.nav.forEach((navigation) => {
                if (navigation.lang != window.config.lang) return;

                if (user) {
                    // User is signed in.
                    document.getElementById('login-button').textContent = navigation.logout;
                    document.getElementById('members').style.display = 'inline';

                    //Show all member-only elements
                    var memberElements = document.getElementsByClassName('members-only'), i;
                    for (var i = 0; i < memberElements.length; i++)
                        memberElements[i].style.display = 'block';
                    //Hide all non-member elements
                    var nonMemberElements = document.getElementsByClassName('non-members'), i;
                    for (var i = 0; i < nonMemberElements.length; i++)
                        nonMemberElements[i].style.display = 'none';
                    //Enable file uploads
                    var fileUploaders = document.getElementsByClassName('inputfile'), i;
                    for (var i = 0; i < fileUploaders.length; i++)
                        fileUploaders[i].disabled = false;
                    //Show admin elements if is admin
                    if (user.isAdmin) {
                        //Hide the not-authorized sign.
                        document.getElementById('not-authorized').style.display = 'none';
                        var adminElements = document.getElementsByClassName('admin-only'), i;
                        for (var i = 0; i < adminElements.length; i++)
                            adminElements[i].style.display = 'block';
                    }
                    //File upload support
                    var fileUploaders = document.getElementsByClassName('inputfile'), i;
                    for (var i = 0; i < fileUploaders.length; i++) {
                        fileUploaders[i].addEventListener('change', handleFileSelect, false);
                    }
                }
                else {
                    // User is signed out.
                    document.getElementById('login-button').textContent = navigation.login;
                    document.getElementById('members').style.display = 'none';

                    //Hide all member-only elements
                    var memberElements = document.getElementsByClassName('members-only'), i;
                    for (var i = 0; i < memberElements.length; i++)
                        memberElements[i].style.display = 'none';
                    //Show all non-member elements
                    var nonMemberElements = document.getElementsByClassName('non-members'), i;
                    for (var i = 0; i < nonMemberElements.length; i++)
                        nonMemberElements[i].style.display = 'block';
                    //Disable file uploads
                    var fileUploaders = document.getElementsByClassName('inputfile'), i;
                    for (var i = 0; i < fileUploaders.length; i++) {
                        fileUploaders[i].disabled = true;
                        label = fileUploaders[i].nextElementSibling;
                        label.querySelector('span').innerHTML = "Choose a file&hellip;";
                        document.getElementById(fileUploaders[i].id + '-link').innerHTML = '';
                    }
                    //Hide Admin Elements
                    var adminElements = document.getElementsByClassName('admin-only'), i;
                    for (var i = 0; i < adminElements.length; i++)
                        adminElements[i].style.display = 'none';
                }
            });

        });
    }

    changeLang(lang) {
        // const oldLang = cookies.get('lang');
        // if (oldLang == lang) return;
        cookies.set('lang', lang, { expires: 7 });
        // if (lang == 'en' && window.location.pathname.includes('/fr/'))
        //     window.location.href = window.location.href.replace('/fr/', '/');
        // else if (lang == 'fr' && !window.location.pathname.includes('/fr/'))
        //     window.location.href = `/fr${window.location.pathname}`;
    }
}