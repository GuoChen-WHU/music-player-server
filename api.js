const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const idPrefix = require('./constants').idPrefix;

/**
 * 统一返回的歌曲信息格式
 * 
 * {
 *   id: 歌曲id,
 *   name: 歌名,
 *   singer: 歌手,
 *   url: 播放地址url,
 *   image: 专辑图片url
 * }
 */

// qq搜索api
const searchUrl = 'http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=50&aggr=1&cr=1&loginUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=1&catZhida=0&remoteplace=sizer.newclient.next_song&w=';
// qq音乐播放地址api
const audioUrl = 'http://ws.stream.qqmusic.qq.com/{{id}}.m4a?fromtag=46';
const getAudioUrl = id => audioUrl.replace('{{id}}', id);
// qq专辑图片url
const imageUrl = 'http://imgcache.qq.com/music/photo/mid_album_90/{{1}}/{{2}}/{{0}}.jpg';
const getImageUrl = f => {
  let id = f.split('|')[22] || 'noid';
  let c1 = id.slice(-2, -1);
  let c2 = id.slice(-1);
  return imageUrl.replace('{{1}}', c1).replace('{{2}}', c2).replace('{{0}}', id);
};

router.get('/search/:keywords', (req, res, next) => {
  let keywords = req.params.keywords;
  let url = encodeURI(searchUrl + keywords);
  return fetch(url)
    .then(response => response.json())
    .then(response => response.data.song.list.map(song => {
      let id = song.f.split('|')[0];
      let name = song.fsong;
      let singer = song.fsinger;
      let url = getAudioUrl(id);
      let image = getImageUrl(song.f);
      return {
        id: id,
        name: name,
        singer: singer,
        url: url,
        image: image
      };
    }))
    .then(result => res.json(result));
});

// 网易云新歌榜api
const toplistNewUrl = 'http://music.163.com/api/playlist/detail?id=3779629';

router.get('/toplist/new/:num', (req, res, next) => {
  return fetch(toplistNewUrl)
    .then(response => response.json())
    .then(response => {
      let num = req.params.num;
      let result = response.result.tracks.slice(0, num).map(song => ({
        id: idPrefix.netEase + song.id,
        name: song.name,
        singer: song.artists.map(artist => artist.name).join(','),
        url: song.mp3Url,
        image: song.album.picUrl
      }));
      res.json(result);
    });
});

module.exports = router;