const params = new URLSearchParams(window.location.search);
let styleHref = params.get('appThemeUrl') + '&liveMode=' + params.get('liveMode');
let buttonAndLinksStyles = ['primary', 'success', 'info', 'warning', 'danger', 'default'];
let dialogData = {buttonStyle : 'primary', type: 'button'};

if (window.parent.document.getElementById('bfAppTheme')) {
    let stylesClone = window.parent.document.getElementById('bfAppTheme').cloneNode(true);
    document.head.appendChild(stylesClone);
}

document.write(`<link href='${styleHref}' rel='stylesheet' onload='render()'> </link>`);

function render() {
    function createElements(type) {
        let container = document.getElementById(type === 'buttons' ? 'buttonsContainer' : 'linksContainer');
        buttonAndLinksStyles.forEach((style, index) => {
            let buttonOrLinkDiv = document.createElement('div');
            buttonOrLinkDiv.className = 'col-xs-6 pull-left margin-top-20';
            buttonOrLinkDiv.className = index === 0 ? buttonOrLinkDiv.className + ' bf-border-primary' : buttonOrLinkDiv.className;
            let buttonOrLink = document.createElement('a');
            buttonOrLink.className = type === 'buttons' ? `bf-btn bf-btn-${style} stretch` : `bf-text-${style}`;
            let itemToClick = type === 'buttons' ? buttonOrLink : buttonOrLinkDiv;
            itemToClick.onclick = () => {
                selectButtonType(style, type === 'buttons' ? 'button' : 'link');
                resetBorder(type === 'buttons' ? 'button' : 'link');
                buttonOrLinkDiv.classList.add('bf-border-primary');
            }
            buttonOrLink.innerText = `${style} ${type === 'buttons' ? 'button' : 'link'}`;
            buttonOrLinkDiv.appendChild(buttonOrLink);
            container.appendChild(buttonOrLinkDiv);
        });
    }
    createElements('buttons');
    createElements('links');
    document.getElementById('main').style.display = 'block';
}

const resetBorder = (type) => {
    if(type === 'button') {
        document.querySelector('#buttonsContainer .bf-border-primary').classList.remove('bf-border-primary');
    } else {
        document.querySelector('#linksContainer .bf-border-primary').classList.remove('bf-border-primary');
    }
}
const selectButtonType = (buttonStyle, type) =>  {
    dialogData = {buttonStyle, type};
}
window.validate = (options, callback) => {
    callback(null, dialogData !== undefined ? dialogData : null);
}
document.getElementsByName('buttonsTypes').forEach((button) => {
    button.onclick = (e) => {
        if(e.target.value === 'links') {
            dialogData = {buttonStyle : 'primary', type: 'link'};
            buttonsContainer.style.display = 'none';
            linksContainer.style.display = 'block';
        } else if (e.target.value === 'buttons') {
            dialogData = {buttonStyle : 'primary', type: 'button'};
            buttonsContainer.style.display = 'block';
            linksContainer.style.display = 'none';
        }
    }
})