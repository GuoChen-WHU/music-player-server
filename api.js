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

// 网易云排行榜api
const toplists = [
  {
    name: '云音乐新歌榜', 
    id: '3779629',
    image: 'http://p3.music.126.net/N2HO5xfYEqyQ8q6oxCw8IQ==/18713687906568048.jpg?param=90y90'
  },
  {
    name: '云音乐热歌榜', 
    id: '3778678',
    image: ''
  },
  {
    name: '网易原创歌曲榜', 
    id: '2884035',
    image: ''
  },
  {
    name: '云音乐飙升榜', 
    id: '19723756',
    image: ''
  },
  {
    name: '云音乐电音榜', 
    id: '10520166',
    image: ''
  },
  {
    name: '美国Billboard周榜', 
    id: '60198',
    image: ''
  },
  {
    name: 'UK排行榜周榜', 
    id: '180106',
    image: ''
  },
  {
    name: 'KTV嗨榜', 
    id: '21845217',
    image: ''
  },
  {
    name: 'iTunes榜', 
    id: '11641012',
    image: ''
  },
  {
    name: 'Hit FM Top榜', 
    id: '120001',
    image: ''
  },
  {
    name: '日本Oricon周榜', 
    id: '60131',
    image: ''
  },
  {
    name: '韩国Melon排行榜周榜', 
    id: '3733003',
    image: ''
  },
  {
    name: '韩国Mnet排行榜周榜', 
    id: '60255',
    image: ''
  },
  {
    name: '韩国Melon原声周榜', 
    id: '46772709',
    image: ''
  },
  {
    name: '中国TOP排行榜(港台榜)', 
    id: '112504',
    image: ''
  },
  {
    name: '中国TOP排行榜(内地榜)', 
    id: '64016',
    image: ''
  },
  {
    name: '香港电台中文歌曲龙虎榜', 
    id: '10169002',
    image: ''
  },
  {
    name: '华语金曲榜', 
    id: '4395559',
    image: ''
  },
  {
    name: '中国嘻哈榜', 
    id: '1899724',
    image: ''
  },
  {
    name: '法国 NRJ EuroHot 30周榜', 
    id: '27135204',
    image: ''
  },
  {
    name: '台湾Hito排行榜', 
    id: '112463',
    image: ''
  },
  {
    name: 'Beatport全球电子舞曲榜', 
    id: '3812895',
    image: ''
  }
];

const toplistUrl = 'http://music.163.com/api/playlist/detail?id=';

router.get('/toplist/:id/:num', (req, res, next) => {
  let searchId = toplists[req.params.id].id;
  return fetch(toplistUrl + searchId)
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