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