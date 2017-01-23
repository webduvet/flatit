# flatnmap
flattens the nested data structure
and optionally maps the object to new template

## Installation
`npm i flatnmap`

## Use
```javascript
var N = require('flatnmap');
```

### Flattening the structure

Original data object example
```javascript
// need to extract items as flat list
const original = {
  delegates: [{
      name: 'some name',
      id: 'd01',
      other: {...},
      // this two level of nesting represent conference and speaker
      itemComfirm: [
        [{
            opening-item
          }, {
            special-item
          }
        ], [{
            fantasy-item
          }]
      ]
  }]
  otherProps: {
  }
}

const confirmMapSample = [{
  key: [{
    prop: ['id'],
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
}], {
  mapper: delegateMap,
  prop: 'delegates'
});

```
the above code will produce a flat structure for all items which are only stored
nested deep in delegates object.
for each desired proprty in the output data we need to include coresponding
mapper and property identifier on the final result.

```javascript
desired output:
{
  id: 'items',
  data: [
    {
      key: {
        delegate: 'd01',
        conference: 001,
        speaker: 01
      },
      model: {
        item-data
      }
    },
    {
      key: {
        delegate: 'd01',
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
sometimes there is a need to reshape the object and strip out all nested structure from the top level
object or simple strip out all unwanted data, flat and map provides optional template property which
expects the object in the desired shape. all existing properties are then mapped to this template.
```javascript
N.normalize(original, [{
  mapper: confirmMapSample,
  prop: 'items'
}], {
  mapper: delegateMap,
  prop: 'delegates',
  template: delegateTemplate
});
```

### mapping template

where the delegate template could look like this:
```javascript
const delegateTemplate = {
  id: undefined,
  name: undefined,
};
```
