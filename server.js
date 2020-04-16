const express = require("express");
const server = express();

const db = require("./db");

// const ideas = [
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
//     title: "Cursos de Programação",
//     category: "Estudo",
//     description:
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto labore ratione iste quidem ips deserunt, voluptas nemo distinctio totam quia sunt dolores asperiores, in cumque autem dolorem, animi obcaecati repudiandae.",
//     url: "http://rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
//     title: "Exercícios",
//     category: "Saúde",
//     description:
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto labore ratione iste quidem ips deserunt, voluptas nemo distinctio totam quia sunt dolores asperiores, in cumque autem dolorem, animi obcaecati repudiandae.",
//     url: "http://rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729032.svg",
//     title: "Karaokê",
//     category: "Diversão em Família",
//     description:
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto labore ratione iste quidem ips deserunt, voluptas nemo distinctio totam quia sunt dolores asperiores, in cumque autem dolorem, animi obcaecati repudiandae.",
//     url: "http://rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
//     title: "Meditação",
//     category: "Mentalidade",
//     description:
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto labore ratione iste quidem ips deserunt, voluptas nemo distinctio totam quia sunt dolores asperiores, in cumque autem dolorem, animi obcaecati repudiandae.",
//     url: "http://rocketseat.com.br"
//   }
// ];


// configurar arquivos estáticos (css, scripts, imagnes)
server.use(express.static("public"));

// habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }));

// configuração do nunjuks (template builder. eg. jinja)
const nunjuks = require("nunjucks");
nunjuks.configure("views", {
  express: server,
  noCache: true // apenas em desenvolvimento, em produção deixar como false
});

server.get("/", function(req, res) {
  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }

    const lastThreeIdeas = [...rows].reverse().slice(0, 3);
    return res.render("index.html", { ideas: lastThreeIdeas });
  });
});

server.get("/ideias", function(req, res) {
  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }

    const all_ideas = [...rows].reverse();
    return res.render("ideias.html", { ideas: all_ideas });
  });
});

server.post("/", function(req, res) {
  const { image, title, category, description, link } = req.body;

  const query = `
  INSERT INTO ideas(
    image,
    title,
    category,
    description,
    link
  ) VALUES (?, ?, ?, ?, ?);
  `;

  const values = [image, title, category, description, link];

  db.run(query, values, function(err) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  });

  return res.redirect("/ideias");
});

server.listen(3333);
