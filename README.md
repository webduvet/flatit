# flatnmap
flattens the nested data structure
and optionally maps the object to new template

## Installation
`npm i flatnmap`

## Use
```javascript
var N = require('flatnmap');

// need to extract items as flat list
const original = {
  delegates: [{
      name: ''
      other: {...},
      itemComfirm: [
        [
          {
            opening-item
          },
          {
            special-item
          }
        ], // conferenve 1
        [
          {
            fantasy-item
          },
        ]  // conference 2
      ]
    },
  ]
  otherProps: {
  }
}

const confirmMapSample = [{
  key: [{
    prop: ['num'],
    name: 'delegate',
  }],
  path: ['delegates'],
}, {
  key: [{
    prop: [],
    name: 'conference',
  }],
  path: ['itemConfirm'],
}, {
  key: [{
    prop: [],
    name: 'speaker',
  }],
  path: [],
}];

N.normalize(original, [{
  mapper: confirmMapSample,
  prop: 'items'
}]);

```
the above code will produce a flat structure for all items which are only stored
nested deep in delegates object.
for each desired proprty in the output data we need to include coresponding
mapper and property identifier on the final result.

```
desired output:
{
  id: 'items',
  data: [
    {
      key: {
        delegate: 1,
        conference: 001,
        speaker: 01
      },
      model: {
        item-data
      }
    },
    {
      key: {
        delegate: 1,
        conference: 002
        speaker: 01
      },
      model: {
        item-data
      }
    }
  ]
}
```
