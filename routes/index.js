var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` SELECT blog_id, blog_txt FROM blog`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Blogging', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`CREATE TABEL blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_txt text NOT NULL);
                      INSERT INTO blog (blog_txt)
                      VALUES ('Bread'),
                             ('Grapes');`,
              () => {
                db.all(` SELECT blog_id, blog_txt FROM blog`, (err, rows) => {
                  res.render('index', { title: 'Blogging', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("Inserting data: " + req.body.blog);
      db.run(`INSERT INTO blog ( blog_txt) VALUES (?)`, [req.body.blog], 
        function(err){
          if (err) {
            return console.error(err.message);
          }
        }
      );
      //redirect to homepage
      res.redirect('/');
    }
  );
})

router.post('/delete', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("Inserting data: " + req.body.blog);
      db.run(`DELETE FROM blog WHERE blog_id=(?)`,[req.body.blog], 
        function(err){
          if (err) {
            return console.error(err.message);
          }
        }
      );     
      res.redirect('/');
    }
  );
})


router.post('/clear', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("Clearing List");
      db.exec(`DELETE FROM blog;`);     
      db.exec(`VACUUM;`);
      res.redirect('/');
    }
  );
})

module.exports = router;