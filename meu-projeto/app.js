const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Middleware para processar os dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

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
  res.sendFile(__dirname + '/index.html');  // Servindo o arquivo de login
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
      // Se a senha ou o e-mail estiverem incorretos
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
  res.sendFile(__dirname + '/principal.html');  // Página principal
});

// Rota para cadastrar usuário
app.get('/cadastrar-usuario', (req, res) => {
  res.sendFile(__dirname + '/cadastrarUsuario.html');  // Página para cadastrar usuário
});

// Rota para cadastrar peça
app.get('/cadastrar-peca', (req, res) => {
  res.sendFile(__dirname + '/cadastrarPeca.html');  // Página para cadastrar peça
});

// Rota para salvar uma nova peça no banco de dados
app.post('/salvar-peca', (req, res) => {
  const { cod, descricao, massa, tempo_usinagem } = req.body;

  // Query SQL para inserir a peça no banco de dados
  const query = 'INSERT INTO pecas (cod, descricao, massa, tempo_usinagem) VALUES (?, ?, ?, ?)';
  connection.execute(query, [cod, descricao, massa, tempo_usinagem], (err, results) => {
    if (err) {
      console.error('Erro ao salvar a peça: ' + err);
      return res.status(500).send('Erro no servidor.');
    }

    // Se a peça for salva com sucesso, redireciona para a página de cadastro de peça
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

  // Query SQL para inserir o usuário no banco de dados
  const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  connection.execute(query, [nome, email, senha], (err, results) => {
    if (err) {
      console.error('Erro ao salvar o usuário: ' + err);
      return res.status(500).send('Erro no servidor.');
    }

    // Se o usuário for salvo com sucesso, redireciona para a página de cadastro de usuário
    res.send(`
      <script>
        alert('Usuário cadastrado com sucesso!');
        window.location.href = '/cadastrar-usuario';
      </script>
    `);
  });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
