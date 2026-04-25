import axios from 'axios';
import FormData from 'form-data';

import fs from 'fs';
import path from 'path';

const api = axios.create({
  baseURL: 
  process.env.NODE_ENV === 'production'
    ? 'https://devburger-api-5t5d.onrender.com'
    : 'http://localhost:3001',
});

const user = {
  email:  'admin@gmail.com',
  password: '123456', // ⚠️ deve ser exatamente igual ao campo usado no SessionController
};

const categories = [
  { name: 'Hambúrguer' },
  { name: 'Bebidas' },
  { name: 'Sobremesas' },
];

const products = [
  {
    name: 'Cheeseburger',
    price: 20,
    category: 'Hambúrguer',
    image: 'cheeseburger.jpg',
  },
  { name: 'X-Bacon', price: 25, category: 'Hambúrguer', image: 'xbacon.jpg' },
  { name: 'Coca-Cola', price: 7, category: 'Bebidas', image: 'coca.png' },
  { name: 'Sorvete', price: 10, category: 'Sobremesas', image: 'sorvete.png' },
];


async function seed() {
  try {
    console.log('🔐 Fazendo login...');

    const login = await api.post('/sessions', user);

    const { token } = login.data;

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    console.log('✅ Login realizado!');

    // Criar categorias
  
        const existingCategory = await api.get('/categories');
       
        for(const cat of categories){
            try {
          const alreadyExists = existingCategory.data.find(
            (c) => c.name === cat.name);
        

        if (alreadyExists) {
          console.log(`⚠️ Categoria ja cadastrada: ${cat.name}`);
          continue;
        }
          
        
        const form = new FormData();
        form.append('name', cat.name);

        await api.post('/categories', form, {
          headers:{  
          ...form.getHeaders(),
            Authorization: `Bearer ${token}`,
          }
        });

        console.log(`✅ Categoria criada: ${cat.name}`);
      } catch (err) {
        console.log(
          `❌ Erro categoria ${cat.name}:`,
          JSON.stringify(err.response?.data || err.message, null, 2),
        );
      }
    }

    // Buscar categorias criadas
    const allCategories = await api.get('/categories');

    // Criar produtos
    for (const prod of products) {
      try {
        const category = allCategories.data.find(
          (c) => c.name === prod.category,
        );

        if (!category) {
          console.log(`⚠️ Categoria não encontrada: ${prod.category}`);
          continue;
        }

     
        const imagePath = path.resolve(`./src/assets/${prod.image}`);

           if (!fs.existsSync(imagePath)) {
          console.log(`⚠️ Imagem não encontrada: ${imagePath}`);
          continue;
        }

        const form = new FormData();
        form.append('name', prod.name);
        form.append('price', prod.price);
        form.append('category_id', category.id);
        form.append(
          'images',
          fs.createReadStream(imagePath),
          path.basename(imagePath),
        );

        await api.post('/products', form, {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${token}`,
          }
        });

        console.log(`✅ Produto criado: ${prod.name}`);
      } catch (err) {
        console.log(
          `❌ Erro produto ${prod.name}:`,
          JSON.stringify(err.response?.data || err.message, null, 2),
        );
      }
    }

    console.log('\n🎉 Seed finalizado com sucesso!');
  } catch (err) {
   console.log('❌ Erro geral completo:');
console.log(err.response?.data);
console.log(err.message);
  }
}

seed();
