/**
 * FakerController
 *
 * @description :: Server-side logic for managing fakers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const path = require('path');
const faker = require('faker');
const moment = require('moment');
const aws = require('aws-sdk');
const fse = require('fs-extra');
aws.config.update({
  accessKeyId: sails.config.s3.key,
  secretAccessKey: sails.config.s3.secret,
  region: sails.config.s3.region
});
const s3 = new aws.S3();

const putObject = (filename, base64data) => {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: sails.config.s3.bucket,
        Key: filename,
        Body: base64data,
        ACL: 'public-read'
      },
      function(error, data) {
        if (error) return reject(error);
        resolve(data);
      }
    );
  });
};
const getUrl = key => {
  return new Promise((resolve, reject) => {
    let urlParams = { Bucket: sails.config.s3.bucket, Key: key };
    s3.getSignedUrl('getObject', urlParams, function(error, url) {
      if (error) return reject(error);
      resolve(url);
    });
  });
};

module.exports = {
  /**
   * Create category
   */
  createRealCategory: asyncWrap(async (req, res) => {
    let categoriesData = [
      {
        name: '全て',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/1.total.png',
          origin: 'https://tokubuy.s3.amazonaws.com/1.total.png'
        }
      },
      {
        name: '1000円',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/2.1000yen.png',
          origin: 'https://tokubuy.s3.amazonaws.com/2.1000yen.png'
        }
      },
      {
        name: 'デジタル',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/3.digital.png',
          origin: 'https://tokubuy.s3.amazonaws.com/3.digital.png'
        }
      },
      {
        name: '家電',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/4.electronic.png',
          origin: 'https://tokubuy.s3.amazonaws.com/4.electronic.png'
        }
      },
      {
        name: 'アクセサリー',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/5.acessory.png',
          origin: 'https://tokubuy.s3.amazonaws.com/5.acessory.png'
        }
      },
      {
        name: '食品&飲料',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/6.drink.png',
          origin: 'https://tokubuy.s3.amazonaws.com/6.drink.png'
        }
      },
      {
        name: 'コスメ・美容',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/7.makeup.png',
          origin: 'https://tokubuy.s3.amazonaws.com/7.makeup.png'
        }
      },
      {
        name: 'スポーツ',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/8.sport.png',
          origin: 'https://tokubuy.s3.amazonaws.com/8.sport.png'
        }
      },
      {
        name: 'ゲーム関連',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/9.game.png',
          origin: 'https://tokubuy.s3.amazonaws.com/9.game.png'
        }
      },
      {
        name: '仮想通貨',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/10. money-bag.png',
          origin: 'https://tokubuy.s3.amazonaws.com/10. money-bag.png'
        }
      },
      {
        name: 'ブランド品',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/11.brand.png',
          origin: 'https://tokubuy.s3.amazonaws.com/11.brand.png'
        }
      },
      {
        name: '小物',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/12. shopping-bag.png',
          origin: 'https://tokubuy.s3.amazonaws.com/12. shopping-bag.png'
        }
      },
      {
        name: 'その他',
        icon: {
          thumb: 'https://tokubuy.s3.amazonaws.com/13.other.png',
          origin: 'https://tokubuy.s3.amazonaws.com/13.other.png'
        }
      }
    ];
    // put all image to s3
    // let images = await fse.readdir(path.join(__dirname, '../..', 'category'));
    // images.forEach(async (image) => {
    //     let data = await fse.readFile(path.join(__dirname, '../../category', image));
    //     let base64data = new Buffer(data, 'binary');
    //     let uploaded = await putObject(image, base64data);
    //     sails.log.info(image);
    //     sails.log.info(uploaded);
    // });

    await Category.remove({});
    for (let i = 0; i < categoriesData.length; i++) {
      let category = categoriesData[i];
      await Category.create(category);
    }

    let categories = await Category.find();

    let products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      let product = products[i],
        category = categories[i % categories.length];
      product.category = category._id;
      await product.save();
    }

    res.ok({ data: categories });
  }),

  /**
   * Clean database
   */
  cleanDb: asyncWrap(async (req, res) => {
    await Auction.remove({});
    await UserChanceBuy.remove({});
    await LogUserChanceBuy.remove({});
    await LogAuctionWinner.remove({});
    res.ok();
  }),
  /**
   * Clean all db
   */
  cleanAllDb: asyncWrap(async (req, res) => {
    await Auction.remove({});
    await UserChanceBuy.remove({});
    await LogUserChanceBuy.remove({});
    await LogAuctionWinner.remove({});

    await Review.remove({});
    await UserLike.remove({});
    await UserComment.remove({});

    res.ok();
  }),

  /**
   * Clean db for staging
   */
  cleanDBForStaging: asyncWrap(async (req, res) => {
    console.log('ddd');

    await Promise.all([
      Auction.remove({}),
      UserChanceBuy.remove({}),
      LogUserChanceBuy.remove({}),
      LogAuctionWinner.remove({}),
      Review.remove({}),
      UserLike.remove({}),
      UserComment.remove({}),
      User.remove({}),
      LogSubtractCoin.remove({}),
      LogUserCoinCharge.remove({}),
      LogUserCoinExchange.remove({}),
      LogUserPoint.remove({}),
      LogUserTask.remove({}),
      MessageChat.remove({}),
      UserAddress.remove({}),
      UserCoin.remove({}),
      UserFavoriteProduct.remove({}),
      UserFriend.remove({}),
      UserPoint.remove({}),
      UserDiscountTicket.remove({})
    ]);

    res.ok();
  }),

  cleanDBAdmin: asyncWrap(async (req, res) => {
    await Admin.remove({});
    res.ok({});
  }),

  /**
   * Test code
   */
  test: asyncWrap(async (req, res) => {
    sails.sockets.blast('auction_complete', { data: 'herer' });

    res.ok({ data: sails.config.environment });
  }),

  /**
   * Fake Categories
   */
  fakeCategory: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity;
    let categories = [];
    for (let i = 0; i < quantity; i++) {
      let category = {
        name: faker.commerce.color(),
        icon: {
          origin: faker.image.image(),
          thumb: faker.image.image()
        }
      };
      categories.push(category);
    }
    let createdCategories = await Category.create(categories);
    res.ok({ data: createdCategories });
  }),

  /**
   * Fake Products
   */
  fakeProduct: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity,
      categories = await Category.find(),
      conditions = await Condition.find(),
      products = [];
    await Product.remove({});
    function randomImages() {
      let images = [],
        randomNumber = faker.random.number(6),
        MIN_IMAGES = randomNumber < 3 ? 3 : randomNumber;

      for (let i = 0; i < MIN_IMAGES; i++) {
        let imageUrl = faker.image.fashion();
        let image = {
          thumb: imageUrl,
          origin: imageUrl
        };
        images.push(image);
      }
      return images;
    }

    for (let i = 0; i < quantity; i++) {
      let chance = faker.random.number(50);
      let product = {
        name: faker.commerce.productName(),
        description: faker.lorem.words(15),
        value: faker.random.number({ min: 1, max: 100 }),
        chanceNumber: chance,
        quantity: faker.random.number(50),
        images: randomImages(),
        featureImage: {
          thumb: faker.image.fashion(),
          origin: faker.image.fashion()
        },
        price: chance * 100,
        isFavorite: true,
        expDateNumber: faker.random.number({ min: 1, max: 10 }),
        category: categories[faker.random.number(categories.length - 1)]._id
        // condition: conditions[faker.random.number(conditions.length - 1)]._id
      };
      products.push(product);
    }

    let createdProducts = await Product.create(products);

    res.ok({ data: createdProducts });
  }),

  /**
   * Fake Auction
   */
  fakeAuction: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity,
      products = await Product.find(),
      auctions = [];
    await Auction.remove({});
    for (let i = 0; i < quantity; i++) {
      let product = products[faker.random.number(products.length - 1)],
        startAt = new Date(2017, 7, faker.random.number(30)),
        expiredAt = new Date(2017, 10, faker.random.number(30)),
        aid;
      let productSellTimes = await Auction.count({ product: product.id });

      if (productSellTimes === product.quantity) continue;
      else aid = productSellTimes + 1;
      aid = i + 1;
      let auction = {
        aid: aid,
        product: product.id,
        chanceNumber: product.chanceNumber,
        status: 1,
        startAt: startAt,
        expiredAt: expiredAt
      };

      auction = await Auction.create(auction);
      auctions.push(auction);

      // create array lucky number in redis
      await AuctionService.createArrayLuckyNumbers(
        auction.id,
        auction.chanceNumber
      );
    }

    res.ok({ data: auctions });
  }),

  /**
   * Fake data user.
   */
  fakeUser: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity;
    let users = [];
    let userAddress = [];
    await User.remove({});
    await UserAddress.remove({});
    function randomImages() {
      let imageUrl = faker.image.fashion();
      return {
        thumb: imageUrl,
        origin: imageUrl
      };
    }

    for (let i = 0; i < quantity; i++) {
      let user = {
        nickname: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: randomImages(),
        password: '123123',
        isVerified: true
      };
      user = await User.create(user);
      let address = {
        user: user._id,
        address: faker.address.streetAddress(),
        fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
        postcode: faker.address.zipCode(),
        province: faker.address.city(),
        district: faker.address.city(),
        town: faker.address.city(),
        street: faker.address.streetName(),
        note: faker.lorem.sentence()
      };
      address = await UserAddress.create(address);
      await User.update(
        { _id: user._id },
        { addressId: address._id },
        { new: true }
      );
      userAddress.push(address);
      users.push(user);
    }
    res.ok({ data: users });
  }),
  /**
   * Fake data log_auction_winner.
   */
  fakeAuctionWinner: asyncWrap(async (req, res) => {
    let logAuctionWinners = [];
    await LogAuctionWinner.remove({});
    let auctions = await Auction.find();
    let users = await User.find();
    function randomUser() {
      let index = Math.floor(Math.random() * users.length);
      return users[index];
    }
    for (let i = 0; i < auctions.length; i++) {
      let auction = auctions[i];
      let user = randomUser();
      if (auction.aid % 5 === 0) {
        let log = {
          user: user.id,
          auction: auction.id
        };
        await Auction.update(
          { _id: auction.id },
          {
            $set: {
              status: 3,
              luckyNumber:
                1000001 + faker.random.number(parseInt(auction.chanceNumber))
            }
          }
        );
        logAuctionWinners.push(log);
      }
    }
    logAuctionWinners = await LogAuctionWinner.create(logAuctionWinners);
    res.ok({ data: logAuctionWinners });
  }),
  /**
   * Fake data user_chance_buy.
   */
  fakeUserChanceBuy: asyncWrap(async (req, res) => {
    let userChanceBuys = [];
    let logUserChanceBuys = [];
    await UserChanceBuy.remove({});
    await LogUserChanceBuy.remove();
    let auctions = await Auction.find();
    let users = await User.find();
    function randomUser() {
      let index = Math.floor(Math.random() * users.length);
      return users[index];
    }
    for (let i = 0; i < auctions.length; i++) {
      let auction = auctions[i];
      let chance = auction.chanceNumber;

      let chanceNumber = Math.floor(Math.random() * auction.chanceNumber + 1);
      if (auction.status === 3) {
        chanceNumber = auction.chanceNumber;
      }
      let luckyNumberArr = [];
      for (let i = 0; i < auction.chanceNumber; i++) {
        let number = 1000001 + i;
        luckyNumberArr.push(number);
      }
      while (chanceNumber > 0) {
        let chanceBuy = Math.floor(Math.random() * chanceNumber + 1);
        let user = randomUser();
        if (chanceBuy > 0) {
          let userChanceBuy = {
            user: user.id,
            auction: auction.id,
            number: chanceBuy,
            ip: sails.helpers.getUserIpAddress()
          };
          chanceNumber -= chanceBuy;
          userChanceBuy = await UserChanceBuy.create(userChanceBuy);
          userChanceBuys.push(userChanceBuy);
          // Faker logUserChanceBuy
          for (let i = 0; i < chanceBuy; i++) {
            if (chance > 0) {
              let luckyNumber = 1000001 + faker.random.number(parseInt(chance));
              while (
                luckyNumberArr.indexOf(luckyNumber) === -1 ||
                luckyNumberArr.length === 0
              ) {
                luckyNumber = 1000001 + faker.random.number(parseInt(chance));
              }
              let logUserChanceBuy = {
                user: user.id,
                auction: auction.id,
                luckyNumber: luckyNumber,
                userChanceBuy: userChanceBuy._id,
                isWinner: false
              };
              logUserChanceBuys.push(logUserChanceBuy);
              let index = luckyNumberArr.indexOf(luckyNumber);
              luckyNumberArr.splice(index, 1);
            }
          }
        }
      }
    }
    userChanceBuys = await UserChanceBuy.create(userChanceBuys);
    await LogUserChanceBuy.create(logUserChanceBuys);
    res.ok({ data: userChanceBuys });
  }),

  /**
   * Thien: fakeUserChanceBuy2
   */
  fakeUserChanceBuy2: asyncWrap(async (req, res) => {
    let chancesBuy = [];
    let quantity = req.params.quantity;
    let users = await User.find({}),
      auctions = await Auction.find({
        status: 1,
        deletedAt: undefined,
        startAt: { $lt: new Date() },
        expiredAt: { $gt: new Date() }
      }).select(
        'id chanceNumber firstBuyUser lastBuyUser mostBuyUser status luckyNumber'
      );

    for (let i = 0; i < quantity; i++) {
      let auction = auctions[faker.random.number(auctions.length - 1)],
        userId = users[faker.random.number(users.length - 1)].id;
      // get all user bought this auction
      let sumChanceSold = 0;
      let usersBuyThisAuction = await UserChanceBuy.find({
        auction: auction.id
      });
      usersBuyThisAuction.forEach(
        document => (sumChanceSold += document.number)
      );

      //return if don't enough chance
      if (auction.chanceNumber - sumChanceSold <= 0)
        return res.badRequest({ message: "don't enough chance" });
      //
      let number =
        auction.chanceNumber - sumChanceSold <= 0
          ? 1
          : faker.random.number(
              auction.chanceNumber - sumChanceSold > 30
                ? 30
                : auction.chanceNumber - sumChanceSold
            );

      let chanceBuy = {
        user: userId,
        auction: auction.id,
        number: number,
        ip: faker.internet.ip()
      };
      let createdChanceBuy = await UserChanceBuy.create(chanceBuy);
      chancesBuy.push(createdChanceBuy);

      // create log user chance buy
      let luckyNumbers = await AuctionService.getRandomLuckyNumbers(
        auction.id,
        number
      );
      let logs = [];
      for (let i = 0; i < luckyNumbers.length; i++) {
        logs.push({
          user: sails.helpers.toObjectId(userId),
          auction: sails.helpers.toObjectId(auction.id),
          luckyNumber: luckyNumbers[i]
        });
      }
      await LogUserChanceBuy.create(logs);

      // let isWinner = (auction.luckyNumber === number);
      //
      // let logChanceBuy = {
      //     user: users[faker.random.number(users.length - 1)].id,
      //     auction: auction.id,
      //     luckyNumber: auction.luckyNumber,
      //     userChanceBuy: createdChanceBuy._id,
      //     isWinner: isWinner
      // };
      //
      // await LogUserChanceBuy.create(logChanceBuy);

      // Update first, last, most buy in to this auction
      if (!auction.firstBuy) {
        auction.firstBuy = createdChanceBuy.id;
        auction.mostBuy = createdChanceBuy.id;
        await auction.save();
      } else {
        let mostBuy = await UserChanceBuy.findById(auction.mostBuy);
        if (mostBuy.number < createdChanceBuy.number)
          auction.mostBuy = createdChanceBuy.id;
        await auction.save();
      }

      if (
        auction.chanceNumber - sumChanceSold - createdChanceBuy.number ===
        0
      ) {
        auction.lastBuy = createdChanceBuy.id;
        auction.finishAt = moment()
          .add(1, 'h')
          .format();
        auction.status = 2;
        await auction.save();
      }
    }

    res.ok({ data: chancesBuy });
  }),

  /**
   * Fake logs user coin charges
   */
  fakeLogUserCoinCharges: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity,
      users = await User.find(),
      logs = [];
    for (let i = 0; i < quantity; i++) {
      let log = {
        user: users[faker.random.number(users.length - 1)]._id,
        coin: faker.random.number(1000),
        money: faker.random.number(1000),
        code: faker.random.number(1000)
      };
      logs.push(log);
    }

    let createdLogUserCoinCharges = await LogUserCoinCharge.create(logs);

    res.ok({ data: createdLogUserCoinCharges });
  }),

  /**
   * Fake logs user coin charges
   */
  fakeTasks: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity,
      tasks = [];

    for (let i = 0; i < quantity; i++) {
      let task = {
        name: faker.name.findName(),
        point: faker.random.number(1000),
        value: faker.random.number(1000),
        startDay: new Date(),
        stopDay: new Date()
      };
      tasks.push(task);
    }

    let createdTasks = await Task.create(tasks);

    res.ok({ data: createdTasks });
  }),

  /**
   * Fake logs user point
   */
  fakeLogUserPoints: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity,
      users = await User.find(),
      tasks = await Task.find(),
      logs = [];

    for (let i = 0; i < quantity; i++) {
      let log = {
        user: users[faker.random.number(users.length - 1)]._id,
        point: faker.random.number(1000),
        task: tasks[faker.random.number(tasks.length) - 1].id,
        from: users[faker.random.number(users.length - 1)]._id
      };
      logs.push(log);
    }

    let createdLogUserPoints = await LogUserPoint.create(logs);

    res.ok({ data: createdLogUserPoints });
  }),

  /**
   * Fake logs user coin exchanges
   */
  fakeLogUserCoinExchanges: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity,
      users = await User.find(),
      logs = [];

    for (let i = 0; i < quantity; i++) {
      let log = {
        user: users[faker.random.number(users.length - 1)].id,
        point: faker.random.number(1000),
        coin: faker.random.number(1000),
        code: faker.random.number(1000),
        status: 1
      };
      logs.push(log);
    }

    let createdLogUserCoinExchanges = await LogUserCoinExchange.create(logs);

    res.ok({ data: createdLogUserCoinExchanges });
  }),

  /**
   * Fake reviews
   */
  fakeReviews: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity,
      winners = await LogAuctionWinner.find(),
      reviews = [];

    function randomImages() {
      let imageUrl = faker.image.fashion();
      return {
        thumb: imageUrl,
        origin: imageUrl
      };
    }

    for (let i = 0; i < quantity; i++) {
      let winner = winners[faker.random.number(winners.length - 1)];
      let review = {
        user: winner.user,
        auction: winner.auction,
        content: faker.lorem.paragraph(),
        image: randomImages(),
        status: 1
      };
      reviews.push(review);
    }

    let createdReviews = await Review.create(reviews);

    res.ok({ data: createdReviews });
  }),

  fakeComments: asyncWrap(async (req, res) => {
    let reviews = await Review.find();
    let users = await User.find();

    let comments = [];
    for (let i = 0; i < req.params.quantity; i++) {
      let comment = {
        user: users[faker.random.number(users.length - 1)]._id,
        review: reviews[faker.random.number(reviews.length - 1)]._id,
        content: faker.lorem.paragraph(),
        status: faker.random.arrayElement([0, 1, 2])
      };
      comments.push(comment);
    }

    res.ok({ data: await UserComment.create(comments) });
  }),

  fakeLikes: asyncWrap(async (req, res) => {
    let reviews = await Review.find();
    let users = await User.find();

    let likes = [];
    for (let i = 0; i < req.params.quantity; i++) {
      let like = {
        user: users[faker.random.number(users.length - 1)]._id,
        review: reviews[faker.random.number(reviews.length - 1)]._id
      };
      likes.push(like);
    }

    res.ok({ data: await UserLike.create(likes) });
  }),

  fakeWinner: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity;
    let auctions = await Auction.find({ status: 2 }).select(
      'id status chanceNumber'
    );
    let users = await User.find({ isVerified: true });
    let winners = [];

    if (!auctions.length || !users.length)
      return res.badRequest({ message: 'no auctions have status:2 or users' });

    for (let i = 0; i < quantity; i++) {
      let auction = auctions[faker.random.number(auctions.length - 1)];
      let user = users[faker.random.number(users.length - 1)];
      let winner = new LogAuctionWinner({
        user: user._id,
        auction: auction._id
      });
      await winner.save();

      winners.push(winner);
      auction.status = 3;
      auction.finishAt = new Date();
      auction.luckyNumber = faker.random.number(Number(auction.chanceNumber));
      await auction.save();
    }

    res.ok({ data: winners });
  }),

  /**
   * fake table condition
   */
  fakeCondition: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity;
    let conditions = [];
    for (let i = 0; i < quantity; i++) {
      let condition = {
        name: faker.name.firstName(),
        value: faker.random.number(100)
      };
      conditions.push(condition);
    }
    let createdCondition = await Condition.create(conditions);
    res.ok({ data: createdCondition });
  }),

  fakeReview: asyncWrap(async (req, res) => {
    Review.remove({});
    let reviews = [];
    let logAuctionWinners = await LogAuctionWinner.find().lean(true);
    function randomImages() {
      let imageUrl = faker.image.fashion();
      return {
        thumb: imageUrl,
        origin: imageUrl
      };
    }
    for (let i in logAuctionWinners) {
      let logAuctionWinner = { ...logAuctionWinners[i] };
      sails.log.info(logAuctionWinner);
      let review = {
        user: logAuctionWinner.user,
        auction: logAuctionWinner.auction,
        review: faker.lorem.words(15),
        image: randomImages(),
        status: 1
      };
      reviews.push(review);
    }
    reviews = await Review.create(reviews);
    return res.ok({ data: reviews });
  }),

  /**
   *  fake log user chance buys
   */
  fakeLogUserChanceBuy: asyncWrap(async (req, res) => {
    LogUserChanceBuy.remove({});
    let users = User.find();
    let auctions = Auction.find();
    let userChanceBuys = UserChanceBuy.find();
    let quantity = req.param.quantity;
    let datas = [];
    for (let i in quantity) {
      let data = {
        user: users[faker.random.number(users.length - 1)]._id,
        auction: auctions[faker.random.number(auctions.length - 1)]._id,
        userChanceBuy:
          userChanceBuys[faker.random.number(userChanceBuys.length - 1)]._id,
        luckyNumber: faker.random.number(1000)
      };
      datas.push(data);
    }
    let createLog = await LogUserChanceBuy.create(datas);
    res.ok({ data: createLog });
  }),

  /**
   *  fake user coin
   */
  fakeUserCoin: asyncWrap(async (req, res) => {
    UserCoin.remove({});
    let users = await User.find();
    let quantity = req.params.quantity;
    let userCoins = [];
    for (let i = 0; i < quantity; i++) {
      let coin = {
        user: users[faker.random.number(users.length - 1)]._id,
        coin: faker.random.number(1000)
      };
      userCoins.push(coin);
    }
    let createUserCoin = await UserCoin.create(userCoins);
    res.ok({ data: createUserCoin });
  }),

  /**
   *  fake user coin
   */
  fakeUserPoint: asyncWrap(async (req, res) => {
    UserPoint.remove({});
    let users = await User.find();
    let quantity = req.params.quantity;
    let userCoins = [];
    for (let i = 0; i < quantity; i++) {
      let coin = {
        user: users[faker.random.number(users.length - 1)]._id,
        point: faker.random.number(1000)
      };
      userCoins.push(coin);
    }
    let createUserCoin = await UserPoint.create(userCoins);
    res.ok({ data: createUserCoin });
  }),

  /**
   *  fake message
   */
  fakeMessage: asyncWrap(async (req, res) => {
    Message.remove({});
    let messageCategory = await MessageCategory.find();
    let quantity = req.params.quantity;
    let messages = [];
    function randomImages() {
      let imageUrl = faker.image.fashion();
      return {
        thumb: imageUrl,
        origin: imageUrl
      };
    }

    for (let i = 0; i < quantity; i++) {
      let msg = {
        title: faker.name.firstName(),
        description: faker.lorem.paragraphs,
        category:
          messageCategory[faker.random.number(messageCategory.length - 1)]._id
      };
      messages.push(msg);
    }
    let createMessage = await Message.create(messages);
    res.ok({ data: createMessage });
  }),

  /**
   *  fake message category
   */
  fakeMessageCategory: asyncWrap(async (req, res) => {
    MessageCategory.remove({});
    let quantity = req.params.quantity;
    let cates = [];
    function randomImages() {
      let imageUrl = faker.image.fashion();
      return {
        thumb: imageUrl,
        origin: imageUrl
      };
    }

    for (let i = 0; i < quantity; i++) {
      let cate = {
        name: faker.name.firstName(),
        icon: randomImages()
      };
      cates.push(cate);
    }
    let createCate = await MessageCategory.create(cates);
    res.ok({ data: createCate });
  }),

  /**
   * fake contactCategory
   */

  fakeContactCategory: asyncWrap(async (req, res) => {
    ContactCategory.remove({});
    let categories = [];
    for (let i = 0; i < 5; i++) {
      let category = {
        name: faker.name.firstName()
      };
      categories.push(category);
    }
    categories = await ContactCategory.create(categories);
    return res.ok({ data: categories });
  }),

  /**
   * fake Contact
   */

  fakeContacts: asyncWrap(async (req, res) => {
    const contactCategory = await ContactCategory.find();
    const user = await User.find();

    Contact.remove({});
    let contacts = [];
    for (let i = 0; i < 100; i++) {
      let contact = {
        title: faker.name.firstName(),
        content: faker.lorem.paragraph(),
        category:
          contactCategory[faker.random.number(contactCategory.length - 1)]._id,
        user: user[faker.random.number(user.length - 1)]._id
      };
      contacts.push(contact);
    }
    contacts = await Contact.create(contacts);
    return res.ok({ data: contacts });
  }),

  /**
   * Fake Campaign
   */
  fakeCampaigns: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity,
      campaigns = [];
    function randomImages() {
      let imageUrl = faker.image.fashion();
      return {
        thumb: imageUrl,
        origin: imageUrl
      };
    }
    for (let i = 0; i < quantity; i++) {
      campaigns.push({
        banner: randomImages(),
        url: '/search?keyword=ab',
        type: Campaign.types.search
      });
    }
    campaigns = await Campaign.create(campaigns);
    res.ok({ data: campaigns });
  }),

  /**
   * Fake data user.
   */
  fakeAdmins: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity;
    let admins = [];
    await Admin.remove({});

    for (let i = 0; i < quantity; i++) {
      let admin = {
        nickname: faker.internet.userName(),
        email: faker.internet.email(),
        gender: 1,
        password: '123123'
      };
      admin = await Admin.create(admin);
      admins.push(admin);
    }
    res.ok({ data: admins });
  }),

  /**
   * migrateRedis
   */
  migrateRedis: asyncWrap(async (req, res) => {
    await UserChanceBuy.remove({});
    await LogAuctionWinner.remove({});
    await Review.remove({});
    await UserComment.remove({});
    await UserLike.remove({});

    let auctions = await Auction.find();

    auctions.forEach(async auction => {
      try {
        await AuctionService.createArrayLuckyNumbers(
          auction.id,
          auction.chanceNumber
        );
      } catch (error) {
        throw error;
      }
    });

    res.json(auctions);
  }),

  /**
   * Calculate lucky number
   */
  calculateNumberB: async (req, res) => {
    try {
      let finishAt = moment()
        .subtract(req.query.mins, 'm')
        .format();

      const cheerio = require('cheerio');
      let weatherHtmlContent = await HttpService.get(sails.config.weatherUri),
        $ = cheerio.load(weatherHtmlContent);

      let hourFinish = moment(finishAt).format('k');

      let offsetRows = 2, // head row of table
        windSpeedColumn = 5,
        temperatureColumn = 2, // oC
        humidityColumn = 7, // %
        mainRow = Number(offsetRows) + Number(hourFinish); //the row we will get info

      // in html element dom format
      mainRow = `#tbl_list tbody tr:nth-child(${mainRow})`;

      let humidity = $(`${mainRow} td:nth-child(${humidityColumn})`).html();
      let temperature = $(
        `${mainRow} td:nth-child(${temperatureColumn})`
      ).html();
      let windSpeed = $(`${mainRow} td:nth-child(${windSpeedColumn})`).html();

      let result = String(windSpeed) + String(temperature) + String(humidity);

      result = result.replace('.', '');
      result = result.replace('.', '');

      res.ok({ data: result });
    } catch (error) {
      throw error;
    }
  },
  fakeLogAuctionWinner: asyncWrap(async (req, res) => {
    let quantity = req.params.quantity;
    let auctions = await Auction.find();
    let users = await User.find();

    await LogAuctionWinner.remove({});

    let logs = [];

    for (let i = 0; i < quantity; i++) {
      let auction = auctions[faker.random.number(auctions.length - 1)];
      let user = users[faker.random.number(users.length - 1)];
      let winner = new LogAuctionWinner({
        user: user._id,
        auction: auction._id,
        luckyNumber: faker.random.number(Number(auction.chanceNumber)),
        finishAt: new Date(),
        numberA: faker.name.firstName(),
        numberB: faker.name.firstName(),
        content: faker.lorem.paragraph()
      });

      log = await LogAuctionWinner.create(winner);
      logs.push(log);
    }
    res.ok({ data: logs });
  }),

  // fake user me friends
  fakeUserFriend: asyncWrap(async (req, res) => {
    let users = await User.find({});
    await UserFriend.remove({});
    sails.log(users);
    let userFriends = [];
    for (let i in users) {
      let totalFriend = faker.random.number(users.length - 1);
      let friends = [];
      // let userFriends = users;
      let isCompare = false;
      let totalBestFriend = 0;
      let totalGoodFriend = 0;
      let totalNormalFriend = 0;
      for (let j = 0; j < totalFriend; j++) {
        if (users[i] === users[j]) {
          isCompare = true;
        } else {
          let status = faker.random.arrayElement([1, 2, 3]);
          switch (status) {
            case 1:
              totalBestFriend++;
              break;
            case 2:
              totalGoodFriend++;
              break;
            case 3:
              totalNormalFriend++;
              break;
          }
          let friend = {
            user: users[j]._id,
            status: status
          };

          friends.push(friend);
        }
      }
      totalFriend = isCompare === true ? totalFriend - 1 : totalFriend;
      let dataUser = {
        user: users[i]._id,
        friends: friends,
        totalFriend,
        totalNormalFriend,
        totalGoodFriend,
        totalBestFriend
      };
      let userCreate = await UserFriend.create(dataUser);
      userFriends.push(userCreate);
    }
    sails.log(userFriends);
    res.ok({ data: userFriends });
  }),

  fakeUserDiscountTicket: asyncWrap(async (req, res) => {
    let promise = await Promise.all([User.find({}), Product.find({})]);
    await UserDiscountTicket.remove();
    let dataUserDiscountTicket = [];
    for (let i = 0; i < promise[0].length; i++) {
      let userDiscountTicket = {
        user: promise[0][i]._id,
        product: promise[1][faker.random.number(promise[1].length - 1)],
        expiredAt: new Date()
      };
      let saveUserDiscountTicket = await UserDiscountTicket.create(
        userDiscountTicket
      );
      dataUserDiscountTicket.push(saveUserDiscountTicket);
    }
    res.ok({ data: dataUserDiscountTicket });
  }),

  getDebug: asyncWrap(async (req, res) => {
    let debugs = await Debug.find({});
    res.jsonx(debugs);
  }),

  fakeReportUser: asyncWrap(async (req, res) => {
    let promise = await Promise.all([Report.remove(), User.find({})]);
    let reports = [];
    for (let i = 0; i < promise[1].length; i++) {
      let isOk = false;
      let toUser = promise[1][faker.random.number(promise[1].length - 1)]._id;
      let fromUser = promise[1][faker.random.number(promise[1].length - 1)]._id;
      if (toUser !== fromUser) isOk = true;
      if (isOk) {
        let reportUser = {
          toUser: toUser,
          fromUser: fromUser,
          content: faker.lorem.words(15),
          isHandle: false
        };
        let report = await Report.create(reportUser);
        reports.push(report);
      }
    }
    res.ok({ data: reports });
  })
};
