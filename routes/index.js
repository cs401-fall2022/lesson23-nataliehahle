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
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='myTable'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select blog_id, blog_title, blog_author, blog_txt from myTable`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Blogging', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table myTable (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_title text NOT NULL,
                     blog_author text NOT NULL,
                     blog_txt text NOT NULL);
                      
                      insert into myTable (blog_title, blog_author, blog_txt)
                      values ('Universe', 'Darth Vader', 'Where is Luke? I can't find him'),
                             ('Log: 66', 'Luke', 'I am in a swamp and my ship is stuck!');`,
              () => {
                db.all(` select blog_id, blog_title, blog_author, blog_txt from myTable`, (err, rows) => {
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
      db.run(`INSERT INTO myTable (blog_title, blog_author, blog_txt) VALUES (?,?,?)`, [req.body.tblog,req.body.aublog,req.body.ablog], 
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
      db.run(`DELETE FROM myTable WHERE blog_id=(?)`,[req.body.dblog], 
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


router.post('/edit', (req, res, next) => { 
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      db.run(`UPDATE myTable SET blog_txt = (?) WHERE blog_id=(?)`,[req.body.etblog, req.body.eblog],
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
      db.exec(`DELETE FROM myTable;`);     
      db.exec(`VACUUM;`);
      res.redirect('/');
    }
  );
})



module.exports = router;