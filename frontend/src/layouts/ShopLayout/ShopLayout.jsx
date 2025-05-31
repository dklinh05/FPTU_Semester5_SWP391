function ShopLayout() {
  return (
    <div>
      {/* <Spinner/> */}
      <Header account_name={account_name || undefined} />
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default ShopLayout;
