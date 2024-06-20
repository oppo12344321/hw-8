const cart_wrap = document.querySelector('.cart_wrap');

const cart_ids = [];
localStorage.setItem('cart_ids', JSON.stringify(cart_ids));

function deleteProduct(id) {
    fetch('https://fakestoreapi.com/products/' + id, {
        method: "DELETE"
    })
    .then(res => console.log(res));
}

function addCart(event) {
    const id = event.target.parentElement.getAttribute('data-id');
    const cart_ids_text = localStorage.getItem('cart_ids');
    const cart_ids = JSON.parse(cart_ids_text);
    cart_ids.push(id);
    localStorage.setItem('cart_ids', JSON.stringify(cart_ids));
}

fetch('https://fakestoreapi.com/products')
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            document.querySelector('.all_products').innerHTML += `
            <div class="all_products_item" data-id="${data[i].id}">
                <img src="${data[i].image}">
                <h2>Name:${data[i].title}</h2>
                <h2>Price:${data[i].price}</h2>
                <button class="addCart" onclick="addCart(event)">Добавить в корзину</button>
                <button class="deleteBtn" style="border-color:red;color:red;margin-top:10px">Удалить</button>
            </div>
            `;
        }
        const deleteBtns = document.querySelectorAll('.deleteBtn');
        for (let i = 0; i < deleteBtns.length; i++) {
            const id = deleteBtns[i].parentElement.getAttribute('data-id');
            deleteBtns[i].addEventListener('click', () => {
                deleteBtns[i].parentElement.remove();
                deleteProduct(id);
            });
        }
        document.getElementById('loader').classList.add('hidden');
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('loader').classList.add('hidden');
    });

function sort(target) {
    fetch(`https://fakestoreapi.com/products?sort=${target.value}`)
        .then(res => res.json())
        .then(data => {
            document.querySelector('.all_products').innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                document.querySelector('.all_products').innerHTML += `
                <div class="all_products_item" data-id="${data[i].id}">
                    <img src="${data[i].image}">
                    <h2>Name:${data[i].title}</h2>
                    <h2>Price:${data[i].price}</h2>
                    <button class="addCart">Добавить в корзину</button>
                    <button class="deleteBtn" style="border-color:red;color:red;margin-top:10px">Удалить</button>
                </div>
                `;
            }
            document.getElementById('loader').classList.add('hidden');
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('loader').classList.add('hidden');
        });
}

document.querySelector('select').addEventListener('change', (event) => {
    document.getElementById('loader').classList.remove('hidden');
    sort(event.target);
});

function openCart() {
    cart_wrap.style.display = 'block';
    const cart_ids = JSON.parse(localStorage.getItem("cart_ids"));
    const products = [];
    const promises = [];

    cart_ids.forEach((id) => {
        const prom = fetch('https://fakestoreapi.com/products/' + id).then(async(response) => {
            const data = await response.json();
            products.push(data);
        });
        promises.push(prom);
    });

    Promise.all(promises)
        .then(() => {
            document.querySelector('.cart_products').innerHTML = '';
            products.forEach((data) => {
                document.querySelector('.cart_products').innerHTML += `
                    <div class="cart_item" data-id="${data.id}">
                        <img src="${data.image}">
                        <div>
                            <h2>Name: ${data.title}</h2>
                            <h2>Price: ${data.price}</h2>
                            <button class="addCart">Добавить в корзину</button>
                            <button class="deleteBtn" style="border-color:red;color:red;margin-top:10px" data-id="${data.id}">Удалить</button>
                        </div>
                    </div>
                `;
            });

            const deleteButtons = document.querySelectorAll('.deleteBtn');
            deleteButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const idToDelete = button.getAttribute('data-id');
                    const index = products.findIndex((product) => product.id === idToDelete);
                    if (index !== -1) {
                        products.filter(index, 1);
                    }
                    button.closest('.cart_item').remove();
                    const updatedCartIds = cart_ids.filter((id) => id !== idToDelete);
                    localStorage.setItem('cart_ids', JSON.stringify(updatedCartIds));
                });
            });
            document.getElementById('loader').classList.add('hidden');
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('loader').classList.add('hidden');
        });
}

document.getElementById('cart').addEventListener('click', () => {
    document.getElementById('loader').classList.remove('hidden');
    openCart();
});

document.querySelector('#close').addEventListener('click', () => {
    cart_wrap.style.display = 'none';
});


// document.querySelector('.limit').oninput = (event)=>{
//     fetch(`https://fakestoreapi.com/products?limit=${event.target.value}`)
//     .then(res => res.json())    
//     .then(data => {
//         document.querySelector('.all_products').innerHTML = ''
//         for (let i = 0; i < data.length; i++) {
//             document.querySelector('.all_products').innerHTML += `
//         <div class="all_products_item" data-id="${data[i].id}">
//             <img src="${data[i].image}">
//             <h2>Name:${data[i].title}</h2>
//             <h2>Price:${data[i].price}</h2>
//             <button>Добавить в корзину</button>
//             <button class="deleteBtn" style="border-color:red;color:red;margin-top:10px">Удалить</button>
//         </div>
//         `
//         }
// })
// }
