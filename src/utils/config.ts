const editorFunctions = [
  `// FUNCTION FOR SET CONTENT //
function handleContentChange(value) {
  setContent(value);
  if (value !== "") {
    if (errors.content.message !== "") {
      setError(prev => ({ ...prev, content: { message: "" } }));
    }
  }
  // console.log( value )
}`,
];
const infiniteScrollFunctions = [
  `  const next = async ( initialized, cursor, where ) => {
    
      try {
        console.log( initialized, where )
        sdk.setTable( "user" )
        const result = await sdk.callRestAPI( { limit: pageSize, cursor: cursor }, "CURSORPAGINATE" )
        console.log( result )
        if ( !result.error ) {
          if ( !initialized ) {
            setCursorPaginateData( () => [ ...result?.list ] )
            // setInitialized( true )
            console.log( "Not initialized" )
          } else {
            setCursorPaginateData( ( prev ) => [ ...prev, ...result?.list ] )
            console.log( " initialized" )
          }
          setCurrentCursor( result?.cursor )
          // setPageSize( result?.limit )
          setNextCursor( result?.nextCursor )
        }
      } catch ( error ) {
        // Do somthing with your error
      }
  }`,
];

export const componentList = [
  {
    id: "2b5b729e-4a2f-69e2-e575-cb37cb4ebecd",
    name: "AddButton",
    tag: "done",
    group: "",
    props: {
      role: "",
      model: "",
      text: "",
      has: {
        props: true,
        state: false,
        function: false,
        context: { global: false, auth: false },
      },
    },
  },

  // {
  //   id: "1a13851b-9f6e-aa02-0076-1f84d507181c",
  //   name: "AddTags",
  //   props: {
  //     has: {
  // props: true,//
  //       state: true,
  //       function: true,
  // context: { global: false, auth: false },
  //     },
  //   },
  // },
  {
    id: "0d63aea5-9106-6598-8b94-3bc51cb47a16",
    name: "Editor",
    tag: "done",
    props: {
      has: {
        state: true,
        props: true,
        function: true,
        customStateErrors: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "8e3a25df-1a4c-1955-2de9-0922c7419287",
    name: "Chat",
    tag: "done",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "4154cfe4-07ad-6ffe-71e6-042b331970af",
    name: "CollapsibleMenu",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },

  {
    id: "65a7123f-b096-1bf9-f742-974222fb3ad1",
    name: "IconCards",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "d8ce6c1c-70d0-5acf-22e5-28c32579f55d",
    name: "DashboardUI",
    tag: "done",
    props: {
      has: {
        props: true,
        state: false,
        function: false,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "36ab7743-5e0c-6fc3-265b-6c30be87bb99",
    name: "LineChart",
    tag: "done",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "1ed02e1a-2b2d-a95d-6466-ff6ad87f0440",
    name: "NumberLabelCard",
    tag: "done",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "af8a289e-fa11-70f3-4dd4-496be2429dd3",
    name: "PieChart",
    tag: "done",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "3cb3b742-ae1a-27cb-46f9-810ebe4780d0",
    name: "Stats",
    tag: "done",
    props: {
      has: {
        props: false,
        state: false,
        function: false,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "51818f2a-a1ff-b94f-64c6-67af89d45949",
    name: "DateRange",
    tag: "done",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "a34f7ae0-8cfe-a6f1-2a91-c10666a46a5c",
    name: "DynamicContentType",
    tag: "pending",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "ace4d180-4869-bea2-44c8-0e4123d9c5eb",
    name: "CategoryFilter",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "36a799ad-59fe-f75e-1a2b-9224849c375f",
    name: "EcomHeader",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "6e8bb184-39d0-c873-178e-b609af5071ae",
    name: "FeaturedProducts",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "f592ab71-f08b-f4fd-83ba-3e0dfedccd81",
    name: "MiniCart",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "654297d4-3fa3-d9a1-1f5d-be6b4e4d6740",
    name: "PaymentElementWrapper",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "face801f-fb30-55ba-fc8d-2f29b0328cf7",
    name: "ProductCardFlat",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "b2073c5e-3faf-d1c5-77b7-c8dc8592db2e",
    name: "ProductCard",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "e0e2c809-d10e-2c3d-26ec-0926aa055d3a",
    name: "ProductList",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "1b72e8a8-bbd8-251a-ad67-8553f06edbf1",
    name: "ProductQuickView",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "8959db9a-87b1-d1d8-7cca-2bed679fb7fb",
    name: "ProductReview",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "37c7ec07-0136-2370-2980-a3c08fa69755",
    name: "ProductSearch",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "a0d12209-0ced-a90c-85c4-9825eac3bf2a",
    name: "ExportButton",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  //   { id: "8ebebc6f-abc7-66bc-cb93-bcac98308112", name: "Header", props: {
  // has: {
  //       props: true,
  //       state: true,
  //       function: true,
  // context: { global: false, auth: false },
  //     }
  //   } },
  //   {
  //     id: "e9c8a242-7252-588c-96b5-106471ea15be",
  //     name: "HorizontalNavbar",
  //  props: {} },
  {
    id: "004f486c-a3ce-b869-8033-b6cb90a935c4",
    name: "ImagePreviewModal",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "edc22694-df9f-7d8d-bfac-b12b9053d71c",
    name: "InfiniteScroll",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "63cb2af1-cfac-8e4d-046c-79b21865ae09",
    name: "InteractiveButton",
    tag: "done",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "8fe3c80e-4746-9873-51cc-edc0d25c74af",
    name: "Loader",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "d5234b27-d5eb-709a-25b4-d3bbf4b7429b",
    name: "LoadingIndicator",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  //   { id: "6cc4b97a-6024-2dbe-6911-92579a375631", name: "map", props: {
  //   has: {
  // props: true,//
  //     state: true,
  //     function: true,
  // context: { global: false, auth: false },
  //   }
  // } },
  {
    id: "5133d3f9-1327-d897-3a7b-27c540bbb3e7",
    name: "MKDForm",
    props: {
      has: {
        props: true,
        state: false,
        function: false,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "788f4de0-b921-fd44-45df-2a8f9cf98083",
    name: "MkdInput",
    tag: "done",
    props: {
      input_type: "text",
      page: "", //Add|Edit|View
      name: "",
      label: "",
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "4dafc6ce-8ba9-d65b-d405-ffdb3bcc016d",
    name: "MkdListTable",
    props: {
      table: "", //Model
      tableRole: "",
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "f3a75064-ac32-3e3a-a494-15b1998bad96",
    name: "Modal",
    tag: "done",
    container: "true",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "51f8130e-f7e4-1e14-4f5d-0791cc6ab3b2",
    name: "MultiSelect",
    tag: "done",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "98347b3f-6af6-4139-fb72-abc4fce529d2",
    name: "PaginationBar",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "3887ed2f-9566-6769-b53f-9a35b0a6af2e",
    name: "PortalWrapper",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "995e98e9-8209-a7fa-8a42-6f6508693247",
    name: "PublicHeader",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "272bf426-72cf-17ba-94c6-3c5363a1889b",
    name: "PublicWrapper",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "b3663fe5-521b-a9cb-b568-09f848ec9a24",
    name: "scheduling",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "1e843c7c-33f0-1feb-1ae3-31e34fb72615",
    name: "SessionExpiredModal",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "6a0040ff-b922-bca3-45f5-f79e8b5c22fe",
    name: "ShedulePostCard",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "e827cdd8-eb0b-73da-feb2-e1ada6bda41e",
    name: "SnackBar",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "stripe-plan-cards",
    name: "StripePlansComponent",
    props: {
      title: "Select Plan",
      columns: 3,
      has: {
        props: true,
        state: true,
        function: true,
        context: {
          global: false,
          auth: false,
        },
      },
    },
  },
  {
    id: "87407211-9b17-64d4-8337-863c9d318e0f",
    name: "StripeCardComponent",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "caf7453f-26d3-c033-b863-df629883de8d",
    name: "StripeChargesComponent",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "97743f4e-3a77-a48c-4d4f-8206c3d0998e",
    name: "StripeInvoicesComponent",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "40466bcf-95d8-a8e3-829a-8a327eef4b7f",
    name: "StripeOnetimeProductsComponent",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "8e7edc69-c3de-5425-e481-44403af762cb",
    name: "StripeOrdersComponent",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "4cd2b9c1-cfa4-3dee-d147-6fb3d023f2ac",
    name: "StripePaginationBar",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "e3c6cba6-1ae9-ae7f-b530-cf24b63c83c5",
    name: "StripePlansComponent",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "dc37f7ee-aedf-022b-db2c-07749748a250",
    name: "StripeRegisterSubscribeComponent",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "061bcb01-f04a-a12e-e1c8-059dbe8086ad",
    name: "StripeSubscriptionComponent",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "ded04c46-4b36-f18a-4875-80a9ee184ae0",
    name: "TopHeader",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "6a4c8b9b-1418-e0f5-a585-3065fa931e60",
    name: "Enable2FA",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "76c30259-37e3-7a80-5e8a-da119808669c",
    name: "Modal",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "81203bcd-deb7-edb5-4852-41d873dfd9af",
    name: "TwoFactorAuthenticate",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  {
    id: "d96716c2-bccf-4d92-2595-2bfa009d9dd9",
    name: "Video",
    tag: "done",
    props: {
      has: {
        props: true,
        state: true,
        function: true,
        context: { global: false, auth: false },
      },
    },
  },
  { id: "audio", name: "audio", tag: "", group: "", props: {} },
  { id: "Image", name: "Image", tag: "", group: "", props: {} },
  { id: "video", name: "NativeVideo", tag: "", group: "", props: {} },
  { id: "heading", name: "heading", tag: "", group: "", props: {} },
  { id: "hr", name: "hr", tag: "", group: "", props: {} },
  { id: "br", name: "br", tag: "", group: "", props: {} },
  { id: "link", name: "link", tag: "", group: "", props: {} },
  { id: "p", name: "p", tag: "", group: "", props: {} },
  { id: "span", name: "span", tag: "", group: "", props: {} },
];

export const componentMap = {
  "2b5b729e-4a2f-69e2-e575-cb37cb4ebecd": {
    name: "AddButton",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "1a13851b-9f6e-aa02-0076-1f84d507181c": {
    name: "AddTags",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "0d63aea5-9106-6598-8b94-3bc51cb47a16": {
    name: "Editor",
    props: {
      props: ["content", "handleContentChange", "errors"],
      states: [{ name: "content", default: '""' }],
      customStateErrors: ["content"],
      context: { auth: [], global: [] },
      functions: [...editorFunctions],
    },
  },
  "8e3a25df-1a4c-1955-2de9-0922c7419287": {
    name: "Chat",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "4154cfe4-07ad-6ffe-71e6-042b331970af": {
    name: "CollapsibleMenu",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "1e1cfc67-65ed-ee96-9280-683d7b75ca3b": {
    name: "CreateNewRoomModal",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "65a7123f-b096-1bf9-f742-974222fb3ad1": {
    name: "IconCards",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "d8ce6c1c-70d0-5acf-22e5-28c32579f55d": {
    name: "DashboardUI",
    props: {
      props: ["navigation", "user", "aside"],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "36ab7743-5e0c-6fc3-265b-6c30be87bb99": {
    name: "LineChart",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "1ed02e1a-2b2d-a95d-6466-ff6ad87f0440": {
    name: "NumberLabelCard",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "af8a289e-fa11-70f3-4dd4-496be2429dd3": {
    name: "PieChart",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "3cb3b742-ae1a-27cb-46f9-810ebe4780d0": {
    name: "Stats",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "51818f2a-a1ff-b94f-64c6-67af89d45949": {
    name: "DateRange",
    props: {
      props: ["selectedDayRange", "setSelectedDayRange"],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "a34f7ae0-8cfe-a6f1-2a91-c10666a46a5c": {
    name: "DynamicContentType",
    props: {
      props: ["contentType", "contentValue", "setContentValue"],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "ace4d180-4869-bea2-44c8-0e4123d9c5eb": {
    name: "CategoryFilter",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "36a799ad-59fe-f75e-1a2b-9224849c375f": {
    name: "EcomHeader",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "6e8bb184-39d0-c873-178e-b609af5071ae": {
    name: "FeaturedProducts",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "f592ab71-f08b-f4fd-83ba-3e0dfedccd81": {
    name: "MiniCart",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "654297d4-3fa3-d9a1-1f5d-be6b4e4d6740": {
    name: "PaymentElementWrapper",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "face801f-fb30-55ba-fc8d-2f29b0328cf7": {
    name: "ProductCardFlat",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "b2073c5e-3faf-d1c5-77b7-c8dc8592db2e": {
    name: "ProductCard",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "e0e2c809-d10e-2c3d-26ec-0926aa055d3a": {
    name: "ProductList",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "1b72e8a8-bbd8-251a-ad67-8553f06edbf1": {
    name: "ProductQuickView",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "8959db9a-87b1-d1d8-7cca-2bed679fb7fb": {
    name: "ProductReview",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "37c7ec07-0136-2370-2980-a3c08fa69755": {
    name: "ProductSearch",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "a0d12209-0ced-a90c-85c4-9825eac3bf2a": {
    name: "ExportButton",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "8ebebc6f-abc7-66bc-cb93-bcac98308112": {
    name: "Header",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "d2550c78-406e-94e5-55a3-428d1cb05eef": {
    name: "HeatMap",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "e9c8a242-7252-588c-96b5-106471ea15be": {
    name: "HorizontalNavbar",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "004f486c-a3ce-b869-8033-b6cb90a935c4": {
    name: "ImagePreviewModal",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "edc22694-df9f-7d8d-bfac-b12b9053d71c": {
    name: "InfiniteScroll",
    props: {
      props: [
        "data",
        "children",
        "height",
        "next",
        "pageSize",
        "nextCursor",
        "className",
        "setPageSize",
        "setNextCursor",
        "currentCursor",
        "setData",
      ],
      states: [
        { name: "selected", default: "[]" },
        { name: "cursorPaginateData", default: "[]" },
        { name: "nextCursor", default: "null" },
        { name: "currentcursor", default: 0 },
        { name: "pageSize", default: 5 },
      ],
      context: { auth: [], global: [] },
      functions: [...infiniteScrollFunctions],
    },
  },
  "63cb2af1-cfac-8e4d-046c-79b21865ae09": {
    name: "InteractiveButton",
    props: {
      props: [
        "loading:interactiveButtonLoading",
        "disabled",
        "type",
        "className",
        "onClick",
      ],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "8fe3c80e-4746-9873-51cc-edc0d25c74af": {
    name: "Loader",
    props: {
      props: ['style:{"":""}'],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "d5234b27-d5eb-709a-25b4-d3bbf4b7429b": {
    name: "LoadingIndicator",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "6cc4b97a-6024-2dbe-6911-92579a375631": {
    name: "map",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "5133d3f9-1327-d897-3a7b-27c540bbb3e7": {
    name: "MKDForm",
    props: {
      props: ["onSubmit:handleSubmit(onSubmit)", 'className:"w-full max-w-lg"'],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "788f4de0-b921-fd44-45df-2a8f9cf98083": {
    name: "MkdInput",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "4dafc6ce-8ba9-d65b-d405-ffdb3bcc016d": {
    name: "MkdListTable",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "f3a75064-ac32-3e3a-a494-15b1998bad96": {
    name: "Modal",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "51f8130e-f7e4-1e14-4f5d-0791cc6ab3b2": {
    name: "MultiSelect",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "98347b3f-6af6-4139-fb72-abc4fce529d2": {
    name: "PaginationBar",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "3887ed2f-9566-6769-b53f-9a35b0a6af2e": {
    name: "PortalWrapper",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "995e98e9-8209-a7fa-8a42-6f6508693247": {
    name: "PublicHeader",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "272bf426-72cf-17ba-94c6-3c5363a1889b": {
    name: "PublicWrapper",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "b3663fe5-521b-a9cb-b568-09f848ec9a24": {
    name: "scheduling",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "1e843c7c-33f0-1feb-1ae3-31e34fb72615": {
    name: "SessionExpiredModal",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "6a0040ff-b922-bca3-45f5-f79e8b5c22fe": {
    name: "ShedulePostCard",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "e827cdd8-eb0b-73da-feb2-e1ada6bda41e": {
    name: "SnackBar",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "stripe-plan-cards": { name: "StripePlanCards" },
  "87407211-9b17-64d4-8337-863c9d318e0f": {
    name: "StripeCardComponent",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "caf7453f-26d3-c033-b863-df629883de8d": {
    name: "StripeChargesComponent",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "97743f4e-3a77-a48c-4d4f-8206c3d0998e": {
    name: "StripeInvoicesComponent",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "40466bcf-95d8-a8e3-829a-8a327eef4b7f": {
    name: "StripeOnetimeProductsComponent",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "8e7edc69-c3de-5425-e481-44403af762cb": {
    name: "StripeOrdersComponent",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "4cd2b9c1-cfa4-3dee-d147-6fb3d023f2ac": {
    name: "StripePaginationBar",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "e3c6cba6-1ae9-ae7f-b530-cf24b63c83c5": {
    name: "StripePlansComponent",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "dc37f7ee-aedf-022b-db2c-07749748a250": {
    name: "StripeRegisterSubscribeComponent",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "061bcb01-f04a-a12e-e1c8-059dbe8086ad": {
    name: "StripeSubscriptionComponent",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "ded04c46-4b36-f18a-4875-80a9ee184ae0": {
    name: "TopHeader",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "6a4c8b9b-1418-e0f5-a585-3065fa931e60": {
    name: "Enable2FA",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "76c30259-37e3-7a80-5e8a-da119808669c": {
    name: "Enanble2FAModal",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "81203bcd-deb7-edb5-4852-41d873dfd9af": {
    name: "TwoFactorAuthenticate",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "893b81b9-5502-4785-1ce4-4ede3a71dae7": {
    name: "VideoItem",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "d96716c2-bccf-4d92-2595-2bfa009d9dd9": {
    name: "Video",
    props: {
      props: [],
      states: [],
      context: { auth: [], global: [] },
      functions: [],
    },
  },
  "MTIzLUZpbGVUYWJsZS00NTY=": { name: "MkdFileTable" },
  MTIzLUZpbGVVcGxvYWQtNDU2: { name: "MkdFileUpload" },
  "MTIzLVFyQ29kZUdlbmVyYXRvci00NTY=": { name: "QrCodeGenerator" },
  "MTIzLVFyQ29kZVJlYWRlci00NTY=": { name: "QrCodeReader" },
  "MTIzLU1rZFRhYkNvbnRhaW5lci00NTY=": { name: "MkdTabContainer" },
  "MTIzLU1rZFNpbXBsZVRhYmxlLTQ1Ng==": { name: "MkdSimpleTable" },
  MTIzLU1rZERlYm91bmNlSW5wdXQtNDU2: { name: "MkdDebounceInput" },
  "MTIzLUNhbWVyYVRvVXBsb2FkLTQ1Ng==": { name: "CameraToUpload" },
  "MTIzLU1rZEpzb25RdWl6LTQ1Ng==": { name: "MkdJsonQuiz" },
  "MTIzLU1rZEdyaWRWaWV3LTQ1Ng==": { name: "MkdGridView" },
  MTIzLU1rZFRyZWxsb0NvbHVtbnMtNDU2: { name: "MkdTrelloColumns" },
  "MTIzLU1rZFdpemFyZENvbnRhaW5lci00NTY=": { name: "MkdWizardContainer" },
  "OTE5ZmVjYjctMGUwNy00NDBiLWJmN2MtZDE2YmRhM2VjZDc5=": {
    name: "submitcontainer",
  },
  "OTE5ZmVjYjctMGUwNy00NDBiLWJmN2MtZDE2YmRhMjZDc5=": { name: "listcontainer" },
  "OTE5ZmVjYjctMGUwNy00NDBiLWJmN2MtZDE2YmRhM2zjZc5=": { name: "viewcontainer" },
  MTIzLUJhY2tCdXR0b24tNDU2: { name: "BackButton" },
  "MTIzLUljb25DYXJkcy00NTY=": { name: "IconCards" },
  "MTIzLURhc2hib2FyZFVJLTQ1Ng==": { name: "DashboardUI" },
  "MTIzLUxpbmVDaGFydC00NTY=": { name: "LineChart" },
  "MTIzLU51bWJlckxhYmVsQ2FyZC00NTY=": { name: "NumberLabelCard" },
  "MTIzLVBpZUNoYXJ0LTQ1Ng==": { name: "PieChart" },
  MTIzLUNoYXRCb3QtNDU2: { name: "ChatBot" },
  "MTIzLU11bHRpcGxlQW5zd2VyLTQ1Ng==": { name: "MultipleAnswer" },
  MTIzLVJhdGluZ1N0YXItNDU2: { name: "RatingStar" },

  audio: { name: "audio" },
  img: { name: "img" },
  video: { name: "NativeVideo" },
  heading: { name: "heading" },
  br: { name: "br" },
  link: { name: "link" },
  p: { name: "p" },
  span: { name: "span" },
};

export const formType = {
  login: "login",
  signup: "signup",
  add: "add",
  edit: "edit",
  search: "search",
  custom: "custom",
};

export const colors = {
  primary: "#4F46E5",
  signup: "signup",
  add: "add",
  edit: "edit",
  search: "search",
  custom: "custom",
};

export const packagingListMap = {
  each: "each",
  carton: "carton",
  pallet: "pallet",
};
export const optionTypes = {
  STATIC: "static",
  DROPDOWN: "dropdown",
};
export const actionsDefault = {
  export: {
    show: true,
    multiple: true,
    action: null,
    showText: false,
    className: "!bg-transparent !border-0 !p-0",
  },
  add: {
    show: true,
    action: null,
    multiple: true,
    showChildren: true,
    children: "+ Add",
  },
};
export const operations = {
  EQUAL: "eq",
  NOT_EQUAL: "neq",
  CONTAINS: "cs",
  NOT_CONTAINS: "ncs",
  START_WITH: "sw",
  NOT_START_WITH: "nsw",
  END_WITH: "ew",
  NOT_END_WITH: "new",
  LESS_THAN: "lt",
  NOT_LESS_THAN: "nlt",
  GREATER_THAN: "gt",
  BETWEEN: "bt",
  NOT_BETWEEN: "nbt",
  LESS_THAN_OR_EQUAL: "le",
  NOT_LESS_THAN_OR_EQUAL: "nle",
  GREATER_THAN_OR_EQUAL: "ge",
  NOT_GREATER_THAN_OR_EQUAL: "nge",
  NOT_GREATER_THAN: "ngt",
  IS_NULL: "is",
  IS_NOT_NULL: "nis",
  IN: "in",
  NOT_IN: "nin",
};

export const operationActions = {
  VISIBILITY: "hide",
  INTERACTION: "disable",
};

export const MKD_DOMAIN = "manaknightdigital.com";
