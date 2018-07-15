// declare requirements
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));


function Classifier(keywords) {
    this.classifiers = keywords;
}
Classifier.prototype = {
    Classify: function (s) {
        var possibleClassifications = {};
        var words = s.toLowerCase().trim().replace(/[^A-Za-z]+/g, " ").split(" ");
        for (var i = 0; i < words.length; i++) {
            if (this.classifiers[words[i]] !== undefined) {
                var pwords = this.classifiers[words[i]];
                for (var j = 0; j < pwords.length; j++) {
                    if (possibleClassifications[pwords[j]] === undefined)
                        possibleClassifications[pwords[j]] = 1;
                    else
                        possibleClassifications[pwords[j]]++;
                }
            }
        }
        if (Object.keys(possibleClassifications).length < 1)
            return [];
        var tuples = [];
        for (var key in possibleClassifications) tuples.push([key, possibleClassifications[key]]);
        tuples.sort(function (a, b) {
            a = a[1];
            b = b[1];
            return a < b ? -1 : (a > b ? 1 : 0);
        });
        tuples.reverse();
        var results = [];
        results.push(tuples[0]);
        for (var j = 1; j < tuples.length; j++) {
            if (results[0][1] > tuples[j][1]) {
                break;
            }
            else
                results.push(tuples[j]);
        }
        var finalClassifications = [];
        for (var x = 0; x < results.length; x++) {
            finalClassifications.push([results[x][0]]);
        }
        return finalClassifications;
    }
};

var myClassifier = new Classifier({
    'hello': ['hi'],
    'hi': ['hi'],
    'sup': ['hi'],
    'yo': ['hi'],
    'hey': ['hi'],
    'french': ['french'],
    'france': ['french'],
    'russian': ['russian'],
    'russia': ['russian'],
    'thai': ['thai'],
    'german': ['german'],
    'vietnamese': ['vietnamese'],
    'vietnam': ['vietnamese'],
    'turkish': ['turkish'],
    'chinese': ['Chinese'],
    'china': ['Chinese'],
    'indian': ['Indian'],
    'india': ['Indian'],
    'japanese': ['Japanese'],
    'japan': ['Japanese'],
    'savory': ['savory'],
    'hearty': ['savory'],
    'aromatic': ['savory'],
    'flavorful': ['savory'],
    'creamy': ['savory'],
    'full-bodied': ['savory'],
    'fragrant': ['savory'],
    'umami': ['savory'],
    'salty': ['salty'],
    'bitter': ['bitter'],
    'tangy': ['bitter'],
    'zesty': ['bitter'],
    'tart': ['bitter'],
    'pungent': ['bitter'],
    'astringent': ['bitter'],
    'rich': ['savory'],
    'savoury': ['savory'],
    'heavy': ['savory'],
    'tasty': ['savory'],
    'spicy': ['spicy'],
    'hot': ['spicy'],
    'fiery': ['spicy'],
    'sweet': ['sweet'],
    'sugary':['sweet'],
    'candied':['sweet'],
    'sour': ['sour'],
    'american': ['American'],
    'thank': ['thank'],
    'thanks': ['thank'],
    'yes': ['thank'],
    'no': ['no'],
    'nope': ['no'],
    'ew': ['no'],
    'same': ['same'],
    'italian': ['Italian'],
    'italy': ['Italian'],
    'italy': ['italian'],
    'mexican': ['Mexican'],
    'mexico': ['Mexican'],
    'greek': ['Greek'],
    'greece': ['Greek'],
    'mediterranean': ['Greek']
});

var data = {
    Chinese: {
        savory: [
            {title: 'Chicken Stir Fry, http://allrecipes.com/recipe/223382/chicken-stir-fry/'},
            {title: 'Stir-fried Beef with Oyster Sauce, http://www.bbcgoodfood.com/recipes/stir-fried-beef-oyster-sauce'},
            {title: 'Scallion Pancakes, http://www.thekitchn.com/how-to-make-scallion-pancakes-cooking-lessons-from-the-kitchn-107405'}
        ],
        sweet: [
            {title: 'Sesame Chicken, http://allrecipes.com/recipe/141191/perfect-sesame-chicken/'},
            {title: 'Ginger Tofu with Pak Choi, http://www.bbcgoodfood.com/recipes/412629/ginger-sweet-tofu-with-pak-choi'},
            {title: 'Lemon Chicken, http://allrecipes.com/recipe/20584/chinese-lemon-chicken/?internalSource=recipe%20hub&referringId=695&referringContentType=recipe%20hub&clickId=cardslot%2095'}
        ],
        spicy: [
            {title: 'Spicy Pork Tenderloin, http://www.food.com/recipe/spicy-chinese-pork-tenderloin-90325'},
            {title: 'Spicy Beef Lettuce Wraps, http://www.food.com/recipe/chinese-spicy-beef-lettuce-wraps-144176'}
        ],
        salty: [
            {title: 'Chinese Fried Rice, http://www.food.com/recipe/chinese-fried-rice-56697'},
            {title: 'Salt-and-Pepper Shrimp, http://www.food.com/recipe/salt-and-pepper-shrimp-232288'}
        ],
        bitter: [
            {title: 'Stir-fried Bitter Melon, https://www.travelchinaguide.com/tour/food/chinese-cooking/stir-fried-bittermelon.htm'}
        ],
        sour: [
            {title: 'Hot and Sour Noodle Soup, http://www.cookingchanneltv.com/recipes/fast-hot-and-sour-noodle-soup.html'}
        ]
    },
    Japanese: {
        savory: [
            {title: 'Miso Soup, http://minimalistbaker.com/15-minute-miso-soup-with-greens-and-tofu/'},
            {title: 'Miso-Marinated Black Cod, http://www.thekitchn.com/recipe-nobu-miso-marinated-black-cod-117238 '},
            {title: 'Sukiyaki, http://www.thekitchn.com/cooking-japanese-sukiyaki-105594'}
        ],
        sweet: [
            {title: 'Baked Teriyaki Chicken, http://allrecipes.com/recipe/9023/baked-teriyaki-chicken/'},
            {title: 'Honey Soy Sauce Chicken, http://www.justonecookbook.com/honey-soy-sauce-chicken-recipe'},
            {title: 'Tamago Egg, http://allrecipes.com/recipe/221923/japanese-tamago-egg/'}
        ],
        spicy: [
            {title: 'Wasabi Crusted Chicken Breast, http://www.food.com/recipe/wasabi-crusted-chicken-breasts-83411'},
            {title: 'Spicy Garlic Edamame, http://www.skinnytaste.com/spicy-garlic-edamame/'},
            {title: 'Spicy Tuna Bowl, http://www.thekitchn.com/diy-spicy-tuna-bowl-123340'}
        ],
        salty: [
            {title: 'Salted Edamame, http://brooklynfarmgirl.com/2014/09/02/easy-salted-edamame-recipe-straight-from-our-container-garden/'},
            {title: 'Shio Koki Asazuke Assorted Vegetable Pickles, https://www.japancentre.com/en/recipes/1427-shio-koji-asazuke-assorted-vegetable-pickles'}
        ],
        bitter: [
            {title: 'Octopus Salad, http://www.japanesecooking101.com/tako-sunomono-octopus-salad-recipe/'}
        ],
        sour: [
            {title: 'Vinegared Cucumber Salad, http://www.japanesecooking101.com/tako-sunomono-octopus-salad-recipe/'}
        ]
    },
    Indian: {
        savory: [
            {title: 'Rava Uttapam Recipe, http://foodviva.com/breakfast-recipes/rava-uttapam/'},
            {title: 'Chicken Tikka Masala, http://www.bonappetit.com/recipe/chicken-tikka-masala'}
        ],
        sweet: [
            {title: 'Moong Dal Halwa, http://www.vegrecipesofindia.com/moong-dal-halwa-recipe-halwa-recipes/'},
            {title: 'Mango Lassi, http://www.easyyummycookery.com/2014/07/mango-lassi.html'}
        ],
        spicy: [
            {title: 'Pork Vindaloo, http://allrecipes.com/recipe/217331/goan-pork-vindaloo/'},
            {title: 'Chicken Curry (Murgh Kari), http://allrecipes.com/recipe/212721/indian-chicken-curry-murgh-kari/?internalSource=hub%20recipe&referringId=233&referringContentType=recipe%20hub&clickId=cardslot%2025'},
            {title: 'Spicy Vegan Potato Curry, http://allrecipes.com/recipe/165190/spicy-vegan-potato-curry/'}
        ],
        salty: [
            {title: 'Spiced Cashews, http://www.food.com/recipe/indian-spiced-cashews-196794'},
            {title: 'Indian Green Cabbage, http://www.food.com/recipe/indian-green-cabbage-385605'}
        ],
        bitter: [
            {title: 'Okra, http://allrecipes.com/recipe/74153/easy-indian-style-okra/?internalSource=staff%20pick&referringId=233&referringContentType=recipe%20hub&clickId=cardslot%207'}
        ],
        sour: [
            {title: 'Hot Onion Relish, http://www.food.com/recipe/indian-hot-onion-relish-28187'}
        ]
    },
    American: {
        savory: [
            {title: 'Chicken Pot Pie, https://www.pillsbury.com/recipes/classic-chicken-pot-pie/1401d418-ac0b-4b50-ad09-c6f1243fb992'},
            {title: 'Shrimp and Grits, http://www.telegraph.co.uk/foodanddrink/recipes/11485582/Classic-shrimp-and-grits-recipe.html'},
            {title: 'Mac and Cheese, http://www.telegraph.co.uk/foodanddrink/recipes/8950784/Cheats-mac-and-cheese-recipe.html'}
        ],
        sweet: [
            {title: 'Maple Salmon, http://allrecipes.com/recipe/51283/maple-salmon/?internalSource=hub%20recipe&referringId=236&referringContentType=recipe%20hub&clickId=cardslot%2019'},
            {title: 'Cole Slaw, http://allrecipes.com/recipe/142027/sweet-restaurant-slaw/?internalSource=hub%20recipe&referringId=236&referringContentType=recipe%20hub&clickId=cardslot%2029'},
            {title: 'Hawaiian Chicken Kabobs, http://allrecipes.com/recipe/20415/hawaiian-chicken-kabobs/?internalSource=recipe%20hub&referringId=236&referringContentType=recipe%20hub&clickId=cardslot%2093'}
        ],
        spicy: [
            {title: 'Buffalo Hot Wings, http://americanfood.about.com/od/appetizers/r/Hot_Wings.htm'},
            {title: 'Spicy Grilled Shrimp, http://americanfood.about.com/od/seafood/r/Grilled_Shrimp.htm'}
        ],
        salty: [
            {title: 'Salt and Pepper Skillet Fries, http://allrecipes.com/recipe/236025/salt-and-pepper-skillet-fries/'},
            {title: 'Caesar Salad, http://www.simplyrecipes.com/recipes/caesar_salad/'}
        ],
        bitter: [
            {title: 'Arugala Salad, http://www.foodnetwork.com/recipes/tyler-florence/arugula-salad-and-ultimate-vinaigrette-recipe.html'}
        ],
        sour: [
            {title: 'Roasted Corn with Chili Lime Butter, http://www.foodnetwork.com/recipes/tyler-florence/roasted-corn-with-chili-lime-butter-recipe.html'}
        ]
    },
    Italian: {
        savory: [
            {title: 'Penne Alla Vodka, http://www.chewoutloud.com/2014/06/16/penne-with-vodka-sauce/'},
            {title: 'Red Wine Beef Ragu, http://www.delish.com/cooking/recipe-ideas/recipes/a36913/red-wine-beef-ragu-recipe-wdy0315/'},
            {title: 'Vegetable and Three-Cheese Stuffed Shells, http://www.delish.com/cooking/recipe-ideas/recipes/a34540/vegetable-three-cheese-stuffed-shells-recipe-123003/http://www.delish.com/cooking/recipe-ideas/recipes/a34540/vegetable-three-cheese-stuffed-shells-recipe-123003/'}
        ],
        sweet: [
            {title: 'Butternut Squash Risotto, http://www.delish.com/cooking/recipe-ideas/recipes/a34383/butternut-squash-risotto-recipe-122820/'},
            {title: 'Chicken Marsala, http://allrecipes.com/recipe/8887/chicken-marsala/?internalSource=hub%20recipe&referringId=723&referringContentType=recipe%20hub&clickId=cardslot%2012'},
            {title: 'Roasted Garlic Mashed Potatoes, http://allrecipes.com/recipe/13829/roasted-garlic-mashed-potatoes/?internalSource=recipe%20hub&referringId=723&referringContentType=recipe%20hub&clickId=cardslot%2097'}
        ],
        spicy: [
            {title: 'Sausage and Peppers, http://www.yummly.com/recipe/Italian-Sausage-and-Peppers-1658614'},
            {title: 'Spicy White Bean and Sausage Soup, http://tasteandsee.com/spicy-italian-white-bean-and-sausage-soup/'}
        ],
        salty: [
            {title: 'Spaghetti Salad, http://www.food.com/recipe/italian-spaghetti-salad-50353'},
            {title: 'Chopped Italian Salad, http://www.food.com/recipe/chopped-italian-salad-172589'}
        ],
        bitter: [
            {title: 'Zuppa Toscana, http://allrecipes.com/recipe/13126/zuppa-toscana/?internalSource=staff%20pick&referringId=723&referringContentType=recipe%20hub&clickId=cardslot%209'}
        ],
        sour: [
            {title: 'Lemon Ice, http://www.food.com/recipe/italian-lemon-ice-granita-59919'}
        ]
    },
    Mexican: {
        savory: [
            {title: 'Enchiladas Verdes, http://www.thekitchn.com/authentic-mexican-recipe-enchi-126901'},
            {title: 'Grilled Cactus and Corn Salad, http://www.thekitchn.com/recipe-grilled-cactus-and-corn-92361'}
        ],
        sweet: [
            {title: 'Elote (Roasted Sweet Corn with Cheese), http://www.thekitchn.com/templatehow-to-make-elote-at-h-92592'},
            {title: 'Red Chile and Pork Stew, http://www.saveur.com/article/Recipes/Carne-Adobada'},
            {title: 'Sweet Corn Tamales, http://www.mexicoinmykitchen.com/2013/09/easy-sweet-corn-tamales-recipe.html'}
        ],
        spicy: [
            {title: 'Tacos De Papa, http://www.saveur.com/article/Recipes/Tacos-de-Papa-Potato-Tacos'},
            {title: 'Huevos Rancheros, http://www.saveur.com/article/Recipes/Huevos-Rancheros-1000080547'}
        ],
        salty: [
            {title: 'Hot Pickled Carrots, http://www.food.com/recipe/mexican-style-hot-pickled-carrots-143736'},
            {title: 'Tortilla Chips, http://www.simplyrecipes.com/recipes/how_to_make_homemade_tortilla_chips/'}
        ],
        bitter: [
            {title: 'Lime Cilantro Rice, http://allrecipes.com/recipe/146000/lime-cilantro-rice/?internalSource=recipe%20hub&referringId=728&referringContentType=recipe%20hub&clickId=cardslot%2090'}
        ],
        sour: [
            {title: 'Civeche, http://www.food.com/recipe/mexican-ceviche-8899'}
        ]
    },
    Greek: {
        savory: [
            {title: 'Spinach and Feta Pita Bake, http://allrecipes.com/recipe/93666/spinach-and-feta-pita-bake/?internalSource=hub%20recipe&referringId=731&referringContentType=recipe%20hub&clickId=cardslot%2020'},
            {title: 'Spanakopita (Spinach Pie), http://allrecipes.com/recipe/18417/spanakopita-greek-spinach-pie/?internalSource=hub%20recipe&referringId=731&referringContentType=recipe%20hub&clickId=cardslot%2025'}
        ],
        sweet: [
            {title: 'Tortellini Salad, http://allrecipes.com/recipe/14210/charlottes-tortellini-salad/?internalSource=recipe%20hub&referringId=731&referringContentType=recipe%20hub&clickId=cardslot%2073'}
        ],
        spicy: [
            {title: 'Spicy Sausage and Tomato Sauce, http://www.mygreekdish.com/recipe/spetsofai-sausages-with-peppers-and-tomato-sauce/'}
        ],
        salty: [
            {title: 'Scrambled Eggs, http://www.food.com/recipe/greek-scrambled-eggs-172242'},
            {title: 'Orzo Salad, http://www.food.com/recipe/greek-orzo-salad-39658'}
        ],
        bitter: [
            {title: 'Greek Salad, http://thepioneerwoman.com/cooking/greek-salad/'}
        ],
        sour: [
            {title: 'Lemon Chicken Soup, http://www.food.com/recipe/greek-lemon-chicken-soup-139902'}
        ]
    }
};

var cuisines = {Chinese: 1, Japanese: 1, Indian: 1, American: 1, Italian: 1, Mexican: 1, Greek: 1};
var flavors = {savory: 1, sweet: 1, spicy: 1, salty: 1, bitter: 1, sour: 1};

var cuisinelist = ['Chinese', 'Japanese', 'Indian', 'American', 'Italian', 'Mexican', 'Greek'];
var flavorlist = ['savory', 'sweet', 'spicy', 'salty', 'bitter', 'sour'];


// Server frontpage
app.get('/', function (req, res) {
    res.send('This is your bots server');
});


// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// main handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            var classifiedMessage = myClassifier.Classify(event.message.text);


            //Our bot is expecting a message like this 'I want to prepare a savory Japanese recipe' or 'I want to cook a sweet Indian cuisine'
            //As such we expect 2 classifiers in a message
            if (classifiedMessage.length  >=2) {
                //Variables intended to hold our 2 items we are expect, flavor, and cuisine
                var cuisine;
                var flavor;
                for (var j = 0; j < classifiedMessage.length; j++) {
                    if (cuisines[classifiedMessage[j]] !== undefined) {
                        cuisine = classifiedMessage[j];
                    }
                    if (flavors[classifiedMessage[j]] !== undefined) {
                        flavor = classifiedMessage[j];
                    }
                }
                if (cuisine === undefined || flavor === undefined) {
                    sendMessage(event.sender.id, {
                        text: "Sorry, I didn't catch that. Here are examples of things I can talk about: 'I want a savory Chinese recipe' or 'Recommend something sweet'. Hope that helps!"
                    });
                }
                else {
                    var firstSubcategory = data[cuisine];
                    var secondSubcategory = firstSubcategory[flavor];
                    var index = Math.floor(Math.random() * secondSubcategory.length);
                    var item = secondSubcategory[index];

                    sendMessage(event.sender.id, {
                        text: 'A great ' + flavor + ' ' + cuisine + ' recipe that you might enjoy preparing is: ' + item.title
                    });
                }
            }

            else {
                if (classifiedMessage.length === 1) {
                    if (classifiedMessage[0] == 'hi') {
                        sendMessage(event.sender.id, {
                            text: 'Hey there. Please specify what cuisine (ie., Chinese, Japanese) and/or a flavor profile (ie., Savory, Sweet) you would like a recipe for. If you don\'t like the recipe I find, try resubmitting your request and I will randomly generate a recipe again.'
                        })
                    }
                    if (classifiedMessage[0] == 'thank') {
                        sendMessage(event.sender.id, {
                            text: 'Of course'
                        })
                    }
                    if (classifiedMessage[0] == 'french') {
                        sendMessage(event.sender.id, {
                            text: 'Sorry, I actually do not have any French recipes at the moment. I am most familiar with Italian, Chinese, Japanese, Indian, Greek, American and Mexican cuisines. Feel free to try one of those.'
                        })
                    }
                    if (classifiedMessage[0] == 'thai') {
                        sendMessage(event.sender.id, {
                            text: 'Sorry, I actually do not have any Thai recipes at the moment. I am most familiar with Italian, Chinese, Japanese, Indian, Greek, American and Mexican cuisines. Feel free to try one of those.'
                        })
                    }
                    if (classifiedMessage[0] == 'german') {
                        sendMessage(event.sender.id, {
                            text: 'Sorry, I actually do not have any German recipes at the moment. I am most familiar with Italian, Chinese, Japanese, Indian, Greek, American and Mexican cuisines. Feel free to try one of those.'
                        })
                    }
                    if (classifiedMessage[0] == 'russian') {
                        sendMessage(event.sender.id, {
                            text: 'Sorry, I actually do not have any Russian recipes at the moment. I am most familiar with Italian, Chinese, Japanese, Indian, Greek, American and Mexican cuisines. Feel free to try one of those.'
                        })
                    }
                    if (classifiedMessage[0] == 'turkish') {
                        sendMessage(event.sender.id, {
                            text: 'Sorry, I actually do not have any Turkish recipes at the moment. I am most familiar with Italian, Chinese, Japanese, Indian, Greek, American and Mexican cuisines. Feel free to try one of those.'
                        })
                    }
                    if (classifiedMessage[0] == 'no') {
                        sendMessage(event.sender.id, {
                            text: 'Sorry you don\'t like it. Please resubmit your request and I will randomly generate a recipe again.'
                        })
                    }
                    if (classifiedMessage[0] == 'same') {
                        sendMessage(event.sender.id, {
                            text: 'My bad, you got the same recipe. My database is small and either I randomly generated it again or I simply do not have anymore under your specificaiton. Try resubmitting again to check.'
                        })
                    }
                    if (classifiedMessage[0] == 'vietnamese') {
                        sendMessage(event.sender.id, {
                            text: 'Sorry, I actually do not have any Vietnamese recipes at the moment. I am most familiar with Italian, Chinese, Japanese, Indian, Greek, American and Mexican cuisines. Feel free to try one of those.'
                        })
                    }
                    if (classifiedMessage[0] == 'Japanese') {
                        var Data = data['Japanese'];
                        var index = Math.floor(Math.random() * flavorlist.length);
                        var Items = Data[flavorlist[index]];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: Item.title + ' is an awesome Japanese recipe! Check it out :)'
                        });
                    }
                    if (classifiedMessage[0] == 'Indian') {
                        var Data = data['Indian'];
                        var index = Math.floor(Math.random() * flavorlist.length);
                        var Items = Data[flavorlist[index]];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: Item.title + ' is a great choice! Enjoy :)'
                        });
                    }
                    if (classifiedMessage[0] == 'Chinese') {
                        var Data = data['Chinese'];
                        var index = Math.floor(Math.random() * flavorlist.length);
                        var Items = Data[flavorlist[index]];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: Item.title + ' is definitely worth cooking up! :D'
                        });
                    }
                    if (classifiedMessage[0] == 'American') {
                        var Data = data['American'];
                        var index = Math.floor(Math.random() * flavorlist.length);
                        var Items = Data[flavorlist[index]];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: Item.title + ' is an awesome American recipe! Check it out :)'
                        });
                    }
                    if (classifiedMessage[0] == 'Italian') {
                        var Data = data['Italian'];
                        var index = Math.floor(Math.random() * flavorlist.length);
                        var Items = Data[flavorlist[index]];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: Item.title + ' is an awesome Italian recipe! Check it out :)'
                        });
                    }
                    if (classifiedMessage[0] == 'Mexican') {
                        var Data = data['Mexican'];
                        var index = Math.floor(Math.random() * flavorlist.length);
                        var Items = Data[flavorlist[index]];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: Item.title + ' puts you right on a beach in Cancun'
                        });
                    }
                    if (classifiedMessage[0] == 'Greek') {
                        var Data = data['Greek'];
                        var index = Math.floor(Math.random() * flavorlist.length);
                        var Items = Data[flavorlist[index]];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: Item.title + ' puts you right on a beach in Mykonos'
                        });
                    }
                    if (classifiedMessage[0] == 'savory') {
                        var index = Math.floor(Math.random() * cuisinelist.length);
                        var Cuisine = cuisinelist[index];
                        var Data = data[Cuisine];
                        var Items = Data['savory'];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: 'Looking to be satiated? You can\'t go wrong with ' + Item.title + '!'
                        });

                    }
                    if (classifiedMessage[0] == 'spicy') {
                        var index = Math.floor(Math.random() * cuisinelist.length);
                        var Cuisine = cuisinelist[index];
                        var Data = data[Cuisine];
                        var Items = Data['spicy'];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: 'If you love hot & spicy, you\'ll dig ' + Item.title + '!'
                        });
                    }
                    if (classifiedMessage[0] == 'sweet') {
                        var index = Math.floor(Math.random() * cuisinelist.length);
                        var Cuisine = cuisinelist[index];
                        var Data = data[Cuisine];
                        var Items = Data['sweet'];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: Item.title + ' is a recipe with just the right tinge of sweet.'
                        });

                    }
                    if (classifiedMessage[0] == 'salty') {
                        var index = Math.floor(Math.random() * cuisinelist.length);
                        var Cuisine = cuisinelist[index];
                        var Data = data[Cuisine];
                        var Items = Data['salty'];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: 'I have a few dishes on the saltier side. Try this one: ' + Item.title + '!'
                        });

                    }
                    if (classifiedMessage[0] == 'bitter') {
                        var index = Math.floor(Math.random() * cuisinelist.length);
                        var Cuisine = cuisinelist[index];
                        var Data = data[Cuisine];
                        var Items = Data['bitter'];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: 'Try making this bitter dish: ' + Item.title + ', it\'s superb'
                        });

                    }
                    if (classifiedMessage[0] == 'sour') {
                        var index = Math.floor(Math.random() * cuisinelist.length);
                        var Cuisine = cuisinelist[index];
                        var Data = data[Cuisine];
                        var Items = Data['sour'];
                        index = Math.floor(Math.random() * Items.length);
                        var Item = Items[index];
                        sendMessage(event.sender.id, {
                            text: 'This dish has just the right amount of sour: ' + Item.title + ''
                        });

                    }
                }
                else {
                    sendMessage(event.sender.id, {
                        text: "Sorry, I didn't catch that. Here are examples of things I can talk about: 'I want a savory Chinese recipe' or 'Recommend something sweet'. Hope that helps!'"

                    });
                }
            }
        }
        else if (event.postback) {
            console.log("Postback received: " + JSON.stringify(event.postback));
        }

        /*******************************************
         ********************************************
         ********************************************
         *******************************************/

        res.sendStatus(200);
    }
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};


/************************************
 *************************************
 ************************************/
