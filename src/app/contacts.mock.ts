import { ContactInput } from "@/package";

export const contactList: ContactInput[] = [
  {
    id: "1",
    identity: "t3tester",
    label: "Tester 3",
    status: "available",
    avatar:
      "https://gravatar.com/avatar/3923e72894ae47c4589919409550c9bd?s=400&d=robohash&r=x",
    data: {
      vendor: {
        id: "1",
        name: "Cisco",
        phone: "+17727948352",
      },
    },
  },
  {
    id: "2",
    identity: "t4tester",
    label: "Tester 4",
    status: "available",
    avatar:
      "https://gravatar.com/avatar/3923e72894ae47c4589919409550r2cd?s=400&d=robohash&r=x",
    data: {
      forwards: [
        {
          id: "3",
          identity: "t2tester",
          label: "Tester 2",
          status: "do-not-disturb",
          avatar:
            "https://gravatar.com/avatar/3923e72894ae47c4589919409550c9bd",
        },
      ],
    },
  },
  {
    id: "3",
    identity: "t2tester",
    label: "Tester 2",
    status: "offline",
    avatar: "https://gravatar.com/avatar/3923e72894ae47c4589919409550c9bd",
  },
  {
    id: "4",
    identity: "9793303975",
    label: "9793303975",
    status: "available",
  },
  {
    id: "5",
    identity: "sarah-jones",
    label: "Sarah Jones",
    status: "unknown",
  },
  {
    id: "6",
    identity: "jdoe",
    label: "John Doe",
    status: "available",
    avatar:
      "https://gravatar.com/avatar/8312e72894ae47c4589919409550b1bd?s=400&d=robohash&r=x",
    data: {
      vendor: {
        id: "2",
        name: "Apple",
        phone: "+19876543210",
      },
    },
  },
  {
    id: "7",
    identity: "mike99",
    label: "Mike Johnson",
    status: "offline",
    avatar:
      "https://gravatar.com/avatar/7292e72894ae47c4589919409550b1cd?s=400&d=robohash&r=x",
    data: {
      forwards: [
        {
          id: "8",
          identity: "alex-m",
          label: "Alex Morgan",
          status: "busy",
          avatar:
            "https://gravatar.com/avatar/1623e72894ae47c4589919409550c9bd",
        },
      ],
    },
  },
  {
    id: "8",
    identity: "alex-m",
    label: "Alex Morgan",
    status: "do-not-disturb",
    avatar: "https://gravatar.com/avatar/1623e72894ae47c4589919409550c9bd",
  },
  {
    id: "9",
    identity: "linda_smith",
    label: "Linda Smith",
    status: "available",
    avatar:
      "https://gravatar.com/avatar/2932e72894ae47c4589919409550b1fd?s=400&d=robohash&r=x",
    data: {
      vendor: {
        id: "3",
        name: "Microsoft",
        phone: "+12345678901",
      },
    },
  },
  {
    id: "10",
    identity: "tom_r",
    label: "Tom Richardson",
    status: "available",
    avatar:
      "https://gravatar.com/avatar/4823e72894ae47c4589919409550b9bd?s=400&d=robohash&r=x",
    data: {
      vendor: {
        id: "4",
        name: "Google",
        phone: "+10123456789",
      },
    },
  },
  {
    id: "11",
    identity: "nancy_l",
    label: "Nancy Lee",
    status: "do-not-disturb",
    avatar:
      "https://gravatar.com/avatar/5732e72894ae47c4589919409550b7bd?s=400&d=robohash&r=x",
  },
  {
    id: "12",
    identity: "robert_b",
    label: "Robert Brown",
    status: "available",
    avatar:
      "https://gravatar.com/avatar/1832e72894ae47c4589919409550a9cd?s=400&d=robohash&r=x",
    data: {
      vendor: {
        id: "5",
        name: "Amazon",
        phone: "+12013456789",
      },
    },
  },
  {
    id: "13",
    identity: "jenny_p",
    label: "Jenny Parker",
    status: "unknown",
  },
  {
    id: "14",
    identity: "george_w",
    label: "George Wilson",
    status: "available",
    avatar:
      "https://gravatar.com/avatar/3923e72894ae47c4589919409550c1cd?s=400&d=robohash&r=x",
    data: {
      vendor: {
        id: "6",
        name: "Facebook",
        phone: "+13103456789",
      },
    },
  },
  {
    id: "15",
    identity: "emily_r",
    label: "Emily Rogers",
    status: "offline",
    avatar:
      "https://gravatar.com/avatar/4932e72894ae47c4589919409550c2bd?s=400&d=robohash&r=x",
  },
  {
    id: "16",
    identity: "daniel_k",
    label: "Daniel King",
    status: "available",
    avatar:
      "https://gravatar.com/avatar/1832e72894ae47c4589919409550b4cd?s=400&d=robohash&r=x",
    data: {
      vendor: {
        id: "7",
        name: "Tesla",
        phone: "+14103456789",
      },
    },
  },
  {
    id: "17",
    identity: "alice_m",
    label: "Alice Martin",
    status: "do-not-disturb",
    avatar:
      "https://gravatar.com/avatar/5923e72894ae47c4589919409550b5bd?s=400&d=robohash&r=x",
  },
  {
    id: "18",
    identity: "chris_t",
    label: "Chris Thompson",
    status: "do-not-disturb",
    avatar:
      "https://gravatar.com/avatar/9832e72894ae47c4589919409550c3cd?s=400&d=robohash&r=x",
  },
  {
    id: "19",
    identity: "patricia_s",
    label: "Patricia Scott",
    status: "available",
    avatar:
      "https://gravatar.com/avatar/2932e72894ae47c4589919409550b2bd?s=400&d=robohash&r=x",
  },
  {
    id: "20",
    identity: "samuel_d",
    label: "Samuel Davis",
    status: "offline",
    avatar:
      "https://gravatar.com/avatar/1823e72894ae47c4589919409550c4bd?s=400&d=robohash&r=x",
  },
];
