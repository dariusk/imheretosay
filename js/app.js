/* global sharing */
var names = '["Jacob","Michael","Joshua","Matthew","Daniel","Christopher","Andrew","Ethan","Joseph","William","Anthony","David","Alexander","Nicholas","Ryan","Tyler","James","John","Jonathan","Noah","Brandon","Christian","Dylan","Samuel","Benjamin","Nathan","Zachary","Logan","Justin","Gabriel","Jose","Austin","Kevin","Elijah","Caleb","Robert","Thomas","Jordan","Cameron","Jack","Hunter","Jackson","Angel","Isaiah","Evan","Isaac","Luke","Mason","Jason","Jayden","Gavin","Aaron","Connor","Aiden","Aidan","Kyle","Juan","Charles","Luis","Adam","Lucas","Brian","Eric","Adrian","Nathaniel","Sean","Alex","Carlos","Ian","Bryan","Owen","Jesus","Landon","Julian","Chase","Cole","Diego","Jeremiah","Steven","Sebastian","Xavier","Timothy","Carter","Wyatt","Brayden","Blake","Hayden","Devin","Cody","Richard","Seth","Dominic","Jaden","Antonio","Miguel","Liam","Patrick","Carson","Jesse","Tristan","Alejandro","Henry","Victor","Trevor","Bryce","Jake","Riley","Colin","Jared","Jeremy","Mark","Caden","Garrett","Parker","Marcus","Vincent","Kaleb","Kaden","Brady","Colton","Kenneth","Joel","Oscar","Josiah","Jorge","Cooper","Ashton","Tanner","Eduardo","Paul","Edward","Ivan","Preston","Maxwell","Alan","Levi","Stephen","Grant","Nicolas","Omar","Dakota","Alexis","George","Collin","Eli","Spencer","Gage","Max","Cristian","Ricardo","Derek","Micah","Brody","Francisco","Nolan","Ayden","Dalton","Shane","Peter","Damian","Jeffrey","Brendan","Travis","Fernando","Peyton","Conner","Andres","Javier","Giovanni","Shawn","Braden","Jonah","Bradley","Cesar","Emmanuel","Manuel","Edgar","Mario","Erik","Edwin","Johnathan","Devon","Erick","Wesley","Oliver","Trenton","Hector","Malachi","Jalen","Raymond","Gregory","Abraham","Elias","Leonardo","Sergio","Donovan","Colby","Marco","Bryson","Martin","Emily","Madison","Emma","Olivia","Hannah","Abigail","Isabella","Samantha","Elizabeth","Ashley","Alexis","Sarah","Sophia","Alyssa","Grace","Ava","Taylor","Brianna","Lauren","Chloe","Natalie","Kayla","Jessica","Anna","Victoria","Mia","Hailey","Sydney","Jasmine","Julia","Morgan","Destiny","Rachel","Ella","Kaitlyn","Megan","Katherine","Savannah","Jennifer","Alexandra","Allison","Haley","Maria","Kaylee","Lily","Makayla","Brooke","Nicole","Mackenzie","Addison","Stephanie","Lillian","Andrea","Zoe","Faith","Kimberly","Madeline","Alexa","Katelyn","Gabriella","Gabrielle","Trinity","Amanda","Kylie","Mary","Paige","Riley","Leah","Jenna","Sara","Rebecca","Michelle","Sofia","Vanessa","Jordan","Angelina","Caroline","Avery","Audrey","Evelyn","Maya","Claire","Autumn","Jocelyn","Ariana","Nevaeh","Arianna","Jada","Bailey","Brooklyn","Aaliyah","Amber","Isabel","Mariah","Danielle","Melanie","Sierra","Erin","Molly","Amelia","Isabelle","Madelyn","Melissa","Jacqueline","Marissa","Shelby","Angela","Leslie","Katie","Jade","Catherine","Diana","Aubrey","Mya","Amy","Briana","Sophie","Gabriela","Breanna","Gianna","Kennedy","Gracie","Peyton","Adriana","Christina","Courtney","Daniela","Lydia","Kathryn","Valeria","Layla","Alexandria","Natalia","Angel","Laura","Charlotte","Margaret","Cheyenne","Mikayla","Miranda","Naomi","Kelsey","Payton","Ana","Alicia","Jillian","Daisy","Mckenzie","Ashlyn","Sabrina","Caitlin","Summer","Ruby","Rylee","Valerie","Skylar","Lindsey","Kelly","Genesis","Zoey","Eva","Sadie","Alexia","Cassidy","Kylee","Kendall","Jordyn","Kate","Jayla","Karen","Tiffany","Cassandra","Juliana","Reagan","Caitlyn","Giselle","Serenity","Alondra","Lucy","Bianca","Kiara","Crystal","Erica","Angelica","Hope","Chelsea","Alana","Liliana","Brittany","Camila","Makenzie","Lilly","Veronica","Abby","Jazmin","Adrianna","Delaney","Karina","Ellie","Jasmin"]';
var nouns = [],
    verbs = [];

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

function generate(nounPlural, verb) {
  nounPlural = nounPlural || nouns.pick().pluralize();
  verb = verb || JSON.parse(names).pick();
  var generatedText = 'My name is ' + verb.titleize() + ' and I\'m here to say<br>I love ' + nounPlural + ' in a major way';
  var sharedText = 'My name is ' + verb.titleize() + ' and I\'m here to say... #imheretosay';
  $('#content').html(generatedText);
  var shareUrl = window.location.href.split('?')[0]+'?word='+sharing.encodeStr(verb)+'$'+sharing.encodeStr(nounPlural);
  $('#share').attr('href', shareUrl);
  $('.twitter-share-button').remove();
  $('#twitterShare').html('<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + shareUrl + '" data-text="' + sharedText + '" data-lang="en">Tweet</a>');
  if (twttr.widgets) {
    twttr.widgets.load();
  }
}

function getWords(suppressGenerate) {
  $.when(
    $.ajax({
      url: 'http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=5&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun&limit=1000&maxLength=22&api_key='+key.API_KEY,
      async: false,
      dataType:'json'
    }),
    $.ajax({
      url: 'http://api.wordnik.com/v4/words.json/randomWords?limit=1000&excludePartOfSpeech=adjective&hasDictionaryDef=true&includePartOfSpeech=verb-transitive&minCorpusCount=1000&api_key='+key.API_KEY,
      async: false,
      dataType:'json'
    })
  ).done(function(noun_data, verb_data) {
    nouns = $.map(noun_data[0], function(el) { return el.word; });
    verbs = $.map(verb_data[0], function(el) { return el.word; });
    if (!suppressGenerate) {
      generate();
    }
  });
}

$('#generate').click(function() { generate(); });
if (sharing.gup('word') === '') {
  getWords();
}
else {
  var verb = sharing.decodeStr(unescape(sharing.gup('word')).split('$')[0]);
  var nounPlural = sharing.decodeStr(unescape(sharing.gup('word')).split('$')[1]);
  getWords(true);
  generate(nounPlural, verb);
}
