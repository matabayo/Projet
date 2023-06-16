
document.addEventListener('DOMContentLoaded', function() {

    const userRemoveButton = document.querySelectorAll('.js-remove-post-button');

    if (userRemoveButton.length !== 0) {
        userRemoveButton.forEach((elem) => {

            elem.addEventListener('click', function(event) {
                const buttonElement = event.target.parentElement;

                const id = buttonElement.getAttribute('data-id');

                const options = {
                    method: 'delete',
                    headers: {
                        'content-type': 'application/json'
                    }
                };
                const url = `/posts/${id}`;
                fetch(url, options)
                    .then(function() {
                        // console.log(suppArticle)
                        suppArticle.forEach((post) => {

                            if (post.getAttribute('data-id') === id) {
                                post.remove();
                            }
                        })
                    })
                    .catch((err) => console.log(err));
            });
        });
    }
});