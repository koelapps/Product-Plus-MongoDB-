const { response, query } = require('express');
const Parser = require('rss-parser');
const async = require('async');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../util/errorResponse');
const RSSCombiner = require('rss-combiner');
const xml2js = require('xml2js');
const { maxHeaderSize } = require('http');
const News = require('../models/News');
const { db } = require('../models/News');
const { set } = require('mongoose');
const { group, groupEnd, groupCollapsed } = require('console');
const groupArray = require('group-array');
const groupBy = require('group-array-by');

//channel Follow
const channelFollow = asyncHandler(async (req, res, next) => {
  const feedConfig = {
    title: 'News From theHindu, TOI, BBC, TheGuardian and Economic Times India',
    size: 15, //maxHeaderSize,
    feeds: [
      'https://www.thehindu.com/news/international/feeder/default.rss',
      'https://www.thehindu.com/news/national/feeder/default.rss',
      'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms',
      'https://timesofindia.indiatimes.com/rssfeeds/1221656.cms',
      'http://feeds.bbci.co.uk/news/technology/rss.xml',
      'https://www.theguardian.com/uk/technology/rss',
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
      let mainTags = {
        National: [
          'National',
          'Andhra Pradesh',
          'Karnataka',
          'Tamil Nadu',
          'Kerala',
          'Other States',
        ],
        International: ['International'],
        Environment: ['Environment'],
        Technology: [
          'Facebook',
          'Technology',
          'US news',
          'social networking',
          'Social media',
          'US politics',
        ],
      };
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
        object.date = element.pubDate;

        //Tags for Feeds
        let array = [];
        array.push(element.category);
        let groups;
        let group = [];
        if (element.category !== null) {
          item = element.category;
        }
        groups = item.reduce((groups, item) => {
          //National Feeds
          for (let i = 0; i <= mainTags.National.length; i++) {
            if (item === mainTags.National[i]) {
              group = groups[item] || [];
              group.push(item);
              groups[group] = 'National';
              return groups;
            }
          }
          for (let i = 0; i <= mainTags.International.length; i++) {
            if (item === mainTags.International[i]) {
              group = groups[item] || [];
              group.push(item);
              groups[group] = 'International';
              return groups;
            }
          }
          for (let i = 0; i <= mainTags.Environment.length; i++) {
            if (item === mainTags.Environment[i]) {
              group = groups[item] || [];
              group.push(item);
              groups[group] = 'National';
              return groups;
            }
          }
          for (let i = 0; i <= mainTags.Technology.length; i++) {
            if (item === mainTags.Technology[i]) {
              group = groups[item] || [];
            }
          }
          group.push(item);
          groups[group] = 'Technology';
          return groups;
        }, {});
        console.log(groups);

        object.tags = groups;

        newsFollow.push(object);
      });
    });
  });

  let newsFeed = [];

  newsFollow.forEach((element) => {
    let object = {};

    object.headLine = element.headLine[0];
    object.description = element.description[0];
    object.link = element.link[0];
    object.category = element.category;
    object.date = element.date;
    object.tags = element.tags;
    newsFeed.push(object);
  });

  let date = new Date().toString();
  let count = feedLength;

  const connect = await News.create(newsFeed);

  const message = 'News Channels added Successfully....!';

  res.json({
    success: true,
    // message: '',
    // title: title,
    // count: feedLength,
    data: { message, title, feedLength, newsFeed },
    // data: result,
  });
});

//channel unFollow
const channelUnFollow = asyncHandler(async (req, res, next) => {
  const news = null;
  const connect = await News.findByIdAndUpdate(req.body.id, { news });
  const message = 'News Channels Removed Successfully....!';
  res.json({
    success: true,
    data: message,
  });
});

//Paginate newsFeed
const paginateFeed = asyncHandler(async (req, res, next) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);

  const results = await News.find()

    .skip((page - 1) * limit)
    .select()
    .limit(limit * 1);
  res.status(200).json({ success: true, data: results });
});

module.exports = {
  channelFollow,
  paginateFeed,
  channelUnFollow,
};
