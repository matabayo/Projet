
// ecoute des evenements sur les pages
document.addEventListener('DOMContentLoaded', function() {
    // recuperation du button pour supprimer son compte avec la class du button
    const userRemoveButtons = document.querySelectorAll('.js-remove-user');
    
    //si il y a une récupération 
    if (userRemoveButtons.length > 0) {
        
        userRemoveButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
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

                    // verification que le compte connecté est le même que le compte à supprimer
                    const role = req.sessions.role;
                    const url = `/user/${id}`;
                    fetch(url, options)
                        .then(function(response) {
                            if(response.ok) {
                                window.location.href ='/logout'
                            } else {
                                document.querySelector('.hidden').innerHTML = 'Suppression du compte non autorisé. Veuillez contactez un administrateur.'
                            }
                        })
                        .catch((err) => console.log(err));
                }

            })
        })
         
    }
    const gameRemoveButtons = document.querySelectorAll('.js-remove-game');

    if(gameRemoveButtons.length > 0) {
        gameRemoveButtons.forEach((button) => {
            button.addEventListener('click', (event) =>{
                const confirmed2 = confirm('Êtes-vous sûr de vouloir supprimer la partie ?');
                if (confirmed2) {
                    const buttonElement2 = event.target;
                    const id2 = buttonElement2.getAttribute('data-id');
                    console.log(id2);
    
                    const options2 = {
                        method :'delete',
                        headers : {
                            'content-type' : 'application/json'
                        }
                    };
                    const url2 = `/game/${id2}`;
                    fetch(url2, options2)
                        .then(function(response) {
                            if(response.ok) {
                                location.reload();
                            }
                            else {
                                console.log(url2);
                                document.querySelector('.hidden').innerHTML = 'Suppression de la partie non autorisée !'
                            }
                        })
                        .catch((error) => console.log(error));
                }
            })
        })
    }
});

document.addEventListener('DOMContentLoaded', () => {
    let dyslexie = false;
    let dyslexieButton = document.getElementById('dyslexie');

    dyslexieButton.addEventListener('click', () => {
        dyslexie = !dyslexie;
        dyslexieButton.classList.toggle('active');
        if (dyslexie) {
            document.body.classList.add('dyslexie');
        } else {
            document.body.classList.remove('dyslexie');
        }
    });
});

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
