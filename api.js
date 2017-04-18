const express = require('express');
const router = express.Router();
const http = require('http');

const searchUrl = 'http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=50&aggr=1&cr=1&loginUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=1&catZhida=0&remoteplace=sizer.newclient.next_song&w=';

router.get('/search/:keywords', (req, res, next) => {
  let keywords = req.params.keywords;
  return new Promise(resolve => {
    let searchResult = '';
    let url = encodeURI(searchUrl + keywords);
    http.get(url, response => {
      response.on('data', data => searchResult += data);
      response.on('end', () => resolve(searchResult));
    });
  }).then(searchResult => res.json(JSON.parse(searchResult)));
});

module.exports = router;