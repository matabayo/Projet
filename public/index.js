
// ecoute des evenements sur les pages
document.addEventListener('DOMContentLoaded', function() {
    // recuperation du button pour supprimer son compte avec la class du button
    const userRemoveButton = document.querySelector('.js-remove-user');
    
    //si il y a une récupération 
    if (userRemoveButton.length !== 0) {
        
        //alors on écoute le click et on applique la function(event) 
        userRemoveButton.addEventListener('click', function(event) {

            // on affiche la confirmation de suppression de compte (pour éviter une suppression par mégarde)
            const confirmed = confirm('Êtes-vous sûr de vouloir supprimer votre compte ?');
            
            // si il y a confirmation on effectue dans le back (controller concerner)
            if (confirmed) {
                const buttonElement = event.target;
                const id = buttonElement.getAttribute('data-id');

                const options = {
                    method: 'delete',
                    headers: {
                        'content-type': 'application/json'
                    }
                };

                const url = `/user/${id}`;
                fetch(url, options)
                    .then(function(response) {
                        if(response.ok) {
                            window.location.href ='/logout'
                        } else {
                            document.querySelector('.hidden').innerHTML = 'Action non autorisé'
                        }
                    })
                    .catch((err) => console.log(err));
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const gameRemoveButton = document.querySelector('.js-remove-game');

    if(gameRemoveButton) {
        gameRemoveButton.addEventListener('click', (event) => {
            const confirmed2 = confirm('Êtes-vous sûr de vouloir supprimer la partie ?');
            if (confirmed2) {
                const buttonElement2 =event
                const options2 = {
                    method :'delete',
                    headers : {
                        'content-type' : 'application/json'
                    }
                };
                const url2 = `/game/${id}`;
                fetch(url2, options2)
                    .then(function() {
                        
                    })
                    .catch((error) => console.log(error));
            }
        })
    }
})

// function editPostEventListener(event) {
//     event.preventDefault();
//     const form = event.target.parentElement;
//     const id = form.querySelector('input[name="id"]').value;
//     const title = form.querySelector('input[name="title"]').value;
//     const content = form.querySelector('textarea[name="content"]').value;

//     const data = {
//         id,
//         title,
//         content
//     };
    
//     const options = {
//         method: 'put',
//         headers: {
//             'content-type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     };
// }
