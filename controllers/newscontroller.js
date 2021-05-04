const { response, query } = require('express');
const Parser = require('rss-parser');
const async = require('async');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../util/errorResponse');
const RSSCombiner = require('rss-combiner');
const xml2js = require('xml2js');
const { maxHeaderSize } = require('http');
const User = require('../models/User');

const channelFollow = asyncHandler(async (req, res, next) => {
  const feedConfig = {
    title:
      'News From theHindu, TOI, BBC, TheGuardian, Economic Times India, News18 and IndiaToday',
    size: maxHeaderSize,
    feeds: [
      'https://www.thehindu.com/feeder/default.rss',
      'https://timesofindia.indiatimes.com/rssfeeds/1221656.cms',
      'http://feeds.bbci.co.uk/news/technology/rss.xml',
      'https://www.theguardian.com/uk/technology/rss',
      'https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms',
      'https://www.news18.com/rss/tech.xml',
      'https://www.indiatoday.in/rss/home',
    ],
    pubDate: new Date(),
  };

  const newsFollow = [];
  let main;
  let follow;
  let title;
  let feedLength;
  let newsInfo;
  await RSSCombiner(feedConfig).then((combinedFeed) => {
    const xml = combinedFeed.xml();
    const parser = xml2js.Parser();
    parser.parseString(xml, (err, result) => {
      main = result;
      follow = result.rss;
      title = follow.channel[0].title[0];
      newsInfo = result.rss.channel[0].item;
      feedLength = newsInfo.length;
      newsInfo.forEach((element) => {
        const object = {};
        object.headLine = element.title;
        object.description = element.description;
        object.link = element.link;
        object.category = element.category;
        newsFollow.push(object);
        // console.log(newsFollow);
      });
    });
  });

  const user = await User.findById(req.body.id);
  // let news = user.news;
  let newsFeed = [];

  newsFollow.forEach((element) => {
    let object = {};

    object.headLine = element.headLine[0];
    object.description = element.description[0];
    object.link = element.link[0];
    object.category = element.category;

    newsFeed.push(object);
  });

  let date = new Date().toString();
  let count = feedLength;
  let news = { date, title, count, newsFeed };

  const connect = await User.findByIdAndUpdate(req.body.id, { news });
  res.json({
    success: true,
    message: 'News Channels added Successfully....!',
    title: title,
    count: feedLength,
    data: newsFeed,
    // data: result,
  });
});

//Paginate newsFeed
const paginateFeed = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const user = await User.findById(req.body.id);
  let feeds = user.news.newsFeed;

  const results = {};

  results.currentPage = {
    page: page,
    limit: limit,
  };

  results.next = {
    page: page + 1,
    limit: limit,
  };

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  const title = user.news.title;
  const date = user.news.date;

  results.data = feeds.toJSON().slice(startIndex, endIndex);
  res.status(200).json({
    sucess: true,
    count: limit.length,
    userName: user.email,
    data: { title, date, results },
  });
});

module.exports = {
  channelFollow,
  paginateFeed,
};
