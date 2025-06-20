function showSuccess(recordsCount) {
    const container = document.getElementById('progress-container');
    const title = container.querySelector('div');
    
    if (container && title) {
        container.style.background = '#d4edda';
        container.style.borderColor = '#28a745';
        title.textContent = '✅ Traitement terminé !';
        title.style.color = '#155724';
        
        updateProgress(100, `${recordsCount} enregistrements ajoutés avec succès`, 'Cliquez pour fermer');
        
        container.style.cursor = 'pointer';
        container.onclick = () => container.remove();
        
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 5000);
    }
}

function showError(errorMessage) {
    const container = document.getElementById('progress-container');
    const title = container.querySelector('div');
    
    if (container && title) {
        container.style.background = '#f8d7da';
        container.style.borderColor = '#dc3545';
        title.textContent = '❌ Erreur';
        title.style.color = '#721c24';
        
        updateProgress(0, errorMessage, 'Cliquez pour fermer');
        
        container.style.cursor = 'pointer';
        container.onclick = () => container.remove();
        
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 8000);
    }
}

function is_All_Num(str)
{
    for (i = 0; i < str.length; i++)
    {
        let code = str.charCodeAt(i);
        if (!(code > 47 && code < 58))
            return false; 
    }
    return true
}

function is_Text(str)
{
    if (is_All_Num(str))
        return false
    for (i = 0; i < str.length; i++)
    {
        let code = str.charCodeAt(i);
        if (!((code > 47 && code < 123) || code === 32))
            return false
    }
    return true
}

document.querySelectorAll('.select-wrapper select').forEach(select => {
    const wrapp = select.parentElement;

    select.addEventListener('focus', () => {
        wrapp.classList.add('open');
        select.style.boxShadow = "0 0 5px 2px #13d78d";
        select.style.outline = "none";
        select.style.borderColor = '#13d78d';
    });

    select.addEventListener('blur', () => {
        wrapp.classList.remove('open');
        styleReset(select)
    });

    select.addEventListener('change', () => {
        wrapp.classList.remove('open');
        styleReset(select)
    });

});

function styleReset(element)
{
    element.style.boxShadow = "";
    element.style.outline = "none";
    element.style.borderColor = "";
}