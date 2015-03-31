function ProjectExplorerController() {
    var vm = this;

    // TODO: get this data from the server
    vm.tags = ['January News', 'February News', 'March News'];

    vm.content = [
        {
        "id": "9afad7b4-af03-4821-b123-c0eabf3a28fc",
        "title": "morbi non quam nec",
        "schema": "Page",
        "author": "Ashley Lane",
        "created": "5/7/2014"
    }, {
        "id": "e88b4195-974c-4373-a1d4-062ee0859641",
        "title": "enim blandit mi in",
        "schema": "Page",
        "author": "Carl Lee",
        "created": "7/5/2014"
    }, {
        "id": "ca711bda-df07-49aa-8269-ac97fe18012c",
        "title": "dui luctus rutrum",
        "schema": "Page",
        "author": "Debra Wood",
        "created": "4/5/2014"
    }, {
        "id": "ec5b9288-b42f-4586-b971-ebdca8aba8e8",
        "title": "in quam fringilla rhoncus mauris",
        "schema": "Page",
        "author": "Jean Griffin",
        "created": "12/10/2014"
    }, {
        "id": "6d94d9d1-ace4-4a26-88d0-4ef9df463bb9",
        "title": "eleifend quam a",
        "schema": "Page",
        "author": "Marie Dean",
        "created": "9/21/2014"
    }, {
        "id": "f591e471-4742-42bb-85a2-22456218aeb9",
        "title": "nisi nam ultrices libero",
        "schema": "Page",
        "author": "Sean Castillo",
        "created": "8/19/2014"
    }, {
        "id": "06ef5a59-f453-466a-babc-cf5c2b4a6355",
        "title": "sed sagittis nam congue",
        "schema": "Page",
        "author": "Jonathan Chapman",
        "created": "1/6/2015"
    }, {
        "id": "871b1eeb-1726-4a5a-a18b-aebc913f6ee3",
        "title": "integer a nibh in quis",
        "schema": "Page",
        "author": "Tammy Henderson",
        "created": "11/1/2014"
    }, {
        "id": "e842d685-e020-4431-97d0-a5f8cc2026a7",
        "title": "ligula suspendisse ornare consequat lectus",
        "schema": "Page",
        "author": "Rebecca Henry",
        "created": "6/14/2014"
    }, {
        "id": "bdb71b1d-a9ff-418d-a62d-04fb5bc9e2b1",
        "title": "hac habitasse platea",
        "schema": "Page",
        "author": "Pamela Holmes",
        "created": "12/7/2014"
    }, {
        "id": "1e57917a-575c-4aea-bc1b-d2981348933f",
        "title": "aliquet maecenas leo odio condimentum",
        "schema": "Page",
        "author": "Ruth Turner",
        "created": "8/17/2014"
    }, {
        "id": "d3bf8220-c712-4026-b5ef-cbfe3bc1152b",
        "title": "id ornare imperdiet",
        "schema": "Page",
        "author": "Brian Flores",
        "created": "8/12/2014"
    }, {
        "id": "abbd94d2-b948-4c63-a15a-762966bfb216",
        "title": "habitasse platea dictumst maecenas ut massa",
        "schema": "Page",
        "author": "Katherine Patterson",
        "created": "7/6/2014"
    }, {
        "id": "1061ecb9-6602-4443-9e48-a07cb4b53ea8",
        "title": "risus auctor sed tristique",
        "schema": "Page",
        "author": "Jacqueline Andrews",
        "created": "12/25/2014"
    }, {
        "id": "916db4ed-3c45-4a63-8222-c3137de09552",
        "title": "elementum eu interdum eu tincidunt",
        "schema": "Page",
        "author": "Kelly Banks",
        "created": "4/20/2014"
    }, {
        "id": "704a19fb-77d7-47d5-8f11-c2115a2559aa",
        "title": "arcu libero rutrum",
        "schema": "Page",
        "author": "Kathleen Wood",
        "created": "1/1/2015"
    }, {
        "id": "8699c2f2-926a-45de-9b3d-8ce8c8f96d0a",
        "title": "tellus nulla ut",
        "schema": "Page",
        "author": "Lisa Richards",
        "created": "11/23/2014"
    }, {
        "id": "e1b5917e-08f9-460f-be9d-b35f27044419",
        "title": "lacus morbi sem mauris",
        "schema": "Page",
        "author": "Kathryn Long",
        "created": "11/1/2014"
    }, {
        "id": "33985069-c024-4b18-8286-b2f438f8494e",
        "title": "ut ultrices vel augue vestibulum ante",
        "schema": "Page",
        "author": "Kathy Wallace",
        "created": "3/19/2015"
    }, {
        "id": "dc15a586-7d50-4e09-9e2b-80173314e038",
        "title": "ante ipsum primis",
        "schema": "Page",
        "author": "Kathleen Rodriguez",
        "created": "8/27/2014"
    }, {
        "id": "a2ad6041-a9c0-4e58-aac6-5b2b31aabed7",
        "title": "vulputate nonummy maecenas tincidunt lacus at",
        "schema": "Page",
        "author": "Judy Sims",
        "created": "5/20/2014"
    }, {
        "id": "f444c1b3-5a04-429f-8381-1d48dc2d7075",
        "title": "magna vulputate luctus cum sociis",
        "schema": "Page",
        "author": "Eugene Payne",
        "created": "6/7/2014"
    }, {
        "id": "46e16364-852f-4442-b868-e4a3a92bb5f0",
        "title": "lectus vestibulum quam",
        "schema": "Page",
        "author": "Lillian Martinez",
        "created": "8/17/2014"
    }, {
        "id": "fe591b12-1758-4f52-a09c-974450e265d5",
        "title": "tristique est et",
        "schema": "Page",
        "author": "Charles Olson",
        "created": "6/30/2014"
    }, {
        "id": "63a3f2cf-8175-4d34-bfdc-2351befa7db9",
        "title": "etiam pretium iaculis",
        "schema": "Page",
        "author": "Thomas Willis",
        "created": "10/1/2014"
    }, {
        "id": "cf4d5905-e912-41df-8978-1ba795f8ce0a",
        "title": "varius ut blandit",
        "schema": "Page",
        "author": "Katherine Butler",
        "created": "1/13/2015"
    }, {
        "id": "4ca2d43d-4b28-422b-9cef-7647ac0feb4e",
        "title": "neque vestibulum eget vulputate ut",
        "schema": "Page",
        "author": "Kimberly Welch",
        "created": "5/15/2014"
    }, {
        "id": "b61ddbac-15d0-496f-a39c-d1937bb8631a",
        "title": "blandit non interdum in ante vestibulum",
        "schema": "Page",
        "author": "Paul Fisher",
        "created": "11/14/2014"
    }, {
        "id": "07aac167-def0-48e5-a44b-bcbb519971d1",
        "title": "nulla elit ac",
        "schema": "Page",
        "author": "Andrea Brooks",
        "created": "9/21/2014"
    }, {
        "id": "47f65e28-f6f0-4859-9e82-5ee2a1739351",
        "title": "platea dictumst aliquam augue",
        "schema": "Page",
        "author": "Robin Campbell",
        "created": "3/27/2015"
    }, {
        "id": "966effe3-d2ad-4c68-9af5-a4a98d05f35d",
        "title": "eget nunc donec quis",
        "schema": "Page",
        "author": "Wayne Wood",
        "created": "1/17/2015"
    }, {
        "id": "d6b9d2c2-b4f1-411f-a132-7976cc7a347a",
        "title": "at lorem integer",
        "schema": "Page",
        "author": "Brian Campbell",
        "created": "8/10/2014"
    }, {
        "id": "deae20ce-7b91-42d0-a211-750fe69281f8",
        "title": "aenean sit amet justo",
        "schema": "Page",
        "author": "Angela Fox",
        "created": "2/20/2015"
    }, {
        "id": "38041b72-7da7-48a7-a76a-7c48a0e49d2f",
        "title": "molestie sed justo pellentesque",
        "schema": "Page",
        "author": "Annie Medina",
        "created": "11/17/2014"
    }, {
        "id": "3927b4d7-e4d8-44cd-9b88-401daf90c841",
        "title": "orci luctus et ultrices",
        "schema": "Page",
        "author": "Theresa Cunningham",
        "created": "10/25/2014"
    }, {
        "id": "08d681b2-4030-46e1-be65-d080a07b5ace",
        "title": "felis sed lacus morbi",
        "schema": "Page",
        "author": "Wayne Taylor",
        "created": "3/5/2015"
    }, {
        "id": "85583851-da61-4078-94e9-9e26bde7446e",
        "title": "dui nec nisi volutpat eleifend",
        "schema": "Page",
        "author": "Laura Reed",
        "created": "5/27/2014"
    }, {
        "id": "2dafc555-54d4-46e2-8502-06c8b9539805",
        "title": "quis augue luctus tincidunt",
        "schema": "Page",
        "author": "Sean Richards",
        "created": "5/30/2014"
    }, {
        "id": "33320a3a-2889-4cf0-9a3a-0404584851b8",
        "title": "vulputate luctus cum sociis natoque",
        "schema": "Page",
        "author": "Christopher Gomez",
        "created": "10/10/2014"
    }, {
        "id": "25d62ad9-82b1-44ce-bfe8-7502b74d3ffb",
        "title": "sit amet nulla quisque arcu",
        "schema": "Page",
        "author": "Pamela Daniels",
        "created": "12/5/2014"
    }, {
        "id": "54bcf391-dbde-40a4-ab77-d4b9faee4490",
        "title": "dis parturient montes nascetur ridiculus",
        "schema": "Page",
        "author": "Jonathan Wheeler",
        "created": "4/3/2014"
    }, {
        "id": "870a45e2-7bc2-4b92-884c-ff5b04c2c9cf",
        "title": "nascetur ridiculus mus vivamus vestibulum",
        "schema": "Page",
        "author": "Patrick Mccoy",
        "created": "7/30/2014"
    }, {
        "id": "66d5e8c1-f71d-456d-b961-b4932326bf6d",
        "title": "eu felis fusce posuere",
        "schema": "Page",
        "author": "Michelle Ferguson",
        "created": "12/14/2014"
    }, {
        "id": "165c08dc-8d75-4979-a19c-09c4d0cc5c64",
        "title": "vehicula condimentum curabitur in libero ut",
        "schema": "Page",
        "author": "Douglas Fowler",
        "created": "3/29/2015"
    }, {
        "id": "a22bfd1d-5f43-4441-bb3f-22d75010438c",
        "title": "ut dolor morbi vel lectus in",
        "schema": "Page",
        "author": "Terry Gilbert",
        "created": "5/7/2014"
    }, {
        "id": "2899d006-b7b6-4359-ad68-8c18a0f8a33c",
        "title": "est quam pharetra magna ac",
        "schema": "Page",
        "author": "Victor Chavez",
        "created": "11/13/2014"
    }, {
        "id": "f894a55e-17d1-4752-b886-4e34e5614fad",
        "title": "sed ante vivamus tortor duis mattis",
        "schema": "Page",
        "author": "Amy Cruz",
        "created": "6/7/2014"
    }, {
        "id": "18628e2f-4ccb-45ed-a640-f03f45276a56",
        "title": "proin risus praesent",
        "schema": "Page",
        "author": "Diane Mccoy",
        "created": "6/5/2014"
    }, {
        "id": "ea5e9fd5-2357-4f89-842c-11cb3b283e5d",
        "title": "posuere cubilia curae",
        "schema": "Page",
        "author": "Deborah Lane",
        "created": "6/1/2014"
    }, {
        "id": "a152311c-db7a-41fd-ba56-8896a97560da",
        "title": "vitae ipsum aliquam non",
        "schema": "Page",
        "author": "Lori Moore",
        "created": "7/19/2014"
    }];
}

angular.module('caiLunAdminUi')
    .controller('ProjectExplorerController', ProjectExplorerController);