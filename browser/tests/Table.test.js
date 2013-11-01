/*
License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
*/
describe('Table', function () {
    it('accepts an options object', function () {
        var t = new Table({
            headings : ['heading_1', 'heading_2'],
            rowLabels : ['*','row_1', 'row_2'],
            caption : 'an example table',
            data : [
                ['first something'],
                ['fourth something']
            ]
        });
        expect(t.headings).toEqual(['heading_1', 'heading_2']);
        expect(t.rowLabels).toEqual(['*','row_1', 'row_2']);
        expect(t.caption).toEqual('an example table');
        expect(t.data).toEqual([
            ['first something'],
            ['fourth something']
        ]);
    });
});

describe('Table.writeData', function () {
    it('should write data to the specified cell', function () {
        var t = new Table();
        t.writeData(1,5,'this is some data');
        expect(t.data[5][1]).toEqual('this is some data');
    });
    it('should write data to the aliased cell', function () {
        var t = new Table();
        t.headings = ['animal', 'name'];
        t.rowLabels = ['owner', 'jim', 'betty'];
        t.writeData('animal', 'jim', 'dog');
        t.writeData('name', 0, 'roofus');
        t.writeData('animal', 'betty', 'cat');
        t.writeData(1, 'betty', 'mew');
        expect(t.data).toEqual([
            ['dog', 'roofus'],
            ['cat', 'mew']
        ]);
    });
});


