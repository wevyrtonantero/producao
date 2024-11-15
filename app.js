const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Middleware para processar os dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Para lidar com JSON nas requisições

// Conectar ao banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '260915',
  database: 'controle_producao'
});

// Verificação de conexão com o MySQL
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL: ' + err.stack);
    return;
  }
  console.log('Conexão com o MySQL bem-sucedida!');
});

// Rota para a página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));  // Servindo o arquivo de login
});

// Rota para processar o login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verificar as credenciais no banco de dados
  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  connection.execute(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro ao verificar login: ' + err);
      return res.status(500).send('Erro no servidor.');
    }

    // Se o usuário for encontrado, redirecionar para a página principal
    if (results.length > 0) {
      res.redirect('/principal');
    } else {
      res.send(`
        <script>
          alert('E-mail ou senha incorretos.');
          window.location.href = '/';
        </script>
      `);
    }
  });
});

// Rota para a página principal
app.get('/principal', (req, res) => {
  res.sendFile(path.join(__dirname, 'principal.html'));  // Página principal
});

// Rota para cadastrar usuário
app.get('/cadastrar-usuario', (req, res) => {
  res.sendFile(path.join(__dirname, 'cadastrarUsuario.html'));  // Página para cadastrar usuário
});

// Rota para cadastrar peça
app.get('/cadastrar-peca', (req, res) => {
  res.sendFile(path.join(__dirname, 'cadastrarPeca.html'));  // Página para cadastrar peça
});

// Rota para salvar uma nova peça no banco de dados
app.post('/salvar-peca', (req, res) => {
  const { cod, descricao, massa, tempo_usinagem } = req.body;

  const query = 'INSERT INTO pecas (cod, descricao, massa, tempo_usinagem) VALUES (?, ?, ?, ?)';
  connection.execute(query, [cod, descricao, massa, tempo_usinagem], (err, results) => {
    if (err) {
      console.error('Erro ao salvar a peça: ' + err);
      return res.status(500).send('Erro no servidor.');
    }

    res.send(`
      <script>
        alert('Peça cadastrada com sucesso!');
        window.location.href = '/cadastrar-peca';
      </script>
    `);
  });
});

// Rota para salvar um novo usuário no banco de dados
app.post('/salvar-usuario', (req, res) => {
  const { nome, email, senha } = req.body;

  const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  connection.execute(query, [nome, email, senha], (err, results) => {
    if (err) {
      console.error('Erro ao salvar o usuário: ' + err);
      return res.status(500).send('Erro no servidor.');
    }

    res.send(`
      <script>
        alert('Usuário cadastrado com sucesso!');
        window.location.href = '/cadastrar-usuario';
      </script>
    `);
  });
});

// Rota para listar usuários
app.get('/listar-usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'listarUsuarios.html'));  // Página de listagem de usuários
});

// Rota para buscar todos os usuários (dados para exibir na lista)
app.get('/usuarios', (req, res) => {
  const query = 'SELECT id, nome, email FROM usuarios';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }
    res.json(results);
  });
});

// Rota para excluir usuário pelo ID
app.delete('/delete-usuario/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM usuarios WHERE id = ?';
  connection.execute(query, [userId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir usuário:', err);
      return res.status(500).json({ success: false });
    }
    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
  });
});
// Rota para listar peças
app.get('/listar-pecas', (req, res) => {
  res.sendFile(path.join(__dirname, 'listarPecas.html')); // Página de listagem de peças
});
// Rota para buscar todas as peças
app.get('/pecas', (req, res) => {
  const query = 'SELECT cod, descricao, massa, tempo_usinagem FROM pecas';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar peças:', err);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }
    res.json(results); // Retorna as peças em formato JSON
  });
});

// Rota para excluir peça pelo código
app.delete('/delete-peca/:cod', (req, res) => {
  const cod = req.params.cod;
  const query = 'DELETE FROM pecas WHERE cod = ?';
  connection.execute(query, [cod], (err, result) => {
    if (err) {
      console.error('Erro ao excluir peça:', err);
      return res.status(500).json({ success: false, error: 'Erro no servidor.' });
    }
    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Peça não encontrada.' });
    }
  });
});

// Rota para a página de produção
app.get('/producao.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'producao.html'));  // Ou o caminho onde o arquivo .html está localizado
});

// Rota para buscar todas as peças
app.get('/producao', (req, res) => {
  const query = 'SELECT cod, descricao, massa, tempo_usinagem FROM pecas';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar peças:', err);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }
    res.json(results); // Retorna as peças em formato JSON
  });
});



// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
