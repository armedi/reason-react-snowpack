[@react.component]
let make = (~serverUrl: option(ReasonReactRouter.url)) => {
  switch (
    ReasonReactRouter.useUrl(
      ~serverUrl=
        Belt.Option.getWithDefault(
          serverUrl,
          {path: [], hash: "", search: ""},
        ),
      (),
    )
  ) {
  | _ => <div> {React.string("Reason React")} </div>
  };
};
