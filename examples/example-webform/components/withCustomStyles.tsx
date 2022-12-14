const withCustomStyles = (
  EnhancedComponent,
  fieldProps = {},
  labelProps = {},
  wrapperProps = {}
) => {
  return function WebformElementWithCustomStyles(props) {
    return (
      <EnhancedComponent
        {...props}
        labelProps={{
          ...(props.labelProps ?? {}),
          ...labelProps,
        }}
        fieldProps={{
          ...(props.fieldProps ?? {}),
          ...fieldProps,
        }}
        wrapperProps={{
          ...(props.wrapperProps ?? {}),
          ...wrapperProps,
        }}
      />
    );
  }
};

export default withCustomStyles;
