import style from "../../styles/swap.module.sass";
import { CloseIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import SPLTokenRegistrySource from "../../utils/tokenList";
import { TOKENS } from "../../utils/tokens";

const TokenList = (props: any) => {
  const [initialList, setList] = useState<any>([]);
  const [searchedList, setSearchList] = useState<any>([]);
  const searchRef = useRef<any>();

  useEffect(() => {
    SPLTokenRegistrySource().then((res: any) => {
      let list: any = [];
      res.map((item: any) => {
        let token = {};
        if (
          TOKENS[item.symbol] &&
          !list.find(
            (t: any) => t.mintAddress === TOKENS[item.symbol].mintAddress
          )
        ) {
          token = TOKENS[item.symbol];
          // @ts-ignore
          token["logoURI"] = item.logoURI;
          // @ts-ignore
          token["address"] = TOKENS[item.symbol].mintAddress;
          list.push(token);
        }
      });
      setList(() => list);
      props.getTokenInfo(list.find((item: any) => item.symbol === "SOL")); // 預設顯示 SOL
    });
  }, []);

  useEffect(() => {
    setSearchList(() => initialList);
  }, [initialList]);

  const setTokenInfo = (item: any) => {
    props.getTokenInfo(item);
    props.toggleTokenList();
  };

  useEffect(() => {
    if (!props.showTokenList) {
      setSearchList(initialList);
      searchRef.current.value = "";
    }
  }, [props.showTokenList]);

  const listItems = (data: any) => {
    return data.map((item: any) => {
      return (
        <div
          className={style.tokenRow}
          key={item.address}
          onClick={() => setTokenInfo(item)}
        >
          <img src={item.logoURI} alt="" className={style.tokenLogo} />
          <div>{item.symbol}</div>
        </div>
      );
    });
  };

  const searchToken = (e: any) => {
    let key = e.target.value.toUpperCase();
    let newList: any = [];
    initialList.map((item: any) => {
      if (item.symbol.includes(key)) {
        newList.push(item);
      }
    });
    setSearchList(() => newList);
  };

  let tokeListComponentStyle;
  if (!props.showTokenList) {
    tokeListComponentStyle = {
      display: "none"
    };
  } else {
    tokeListComponentStyle = {
      display: "block"
    };
  }

  return (
    <div className={style.tokeListComponent} style={tokeListComponentStyle}>
      <div className={style.tokeListContainer}>
        <div className={style.header}>
          <div>Select a token</div>
          <div className={style.closeIcon} onClick={props.toggleTokenList}>
            <CloseIcon w={5} h={5} />
          </div>
        </div>
        <div className={style.inputBlock}>
          <input
            type="text"
            placeholder="Search name or mint address"
            ref={searchRef}
            className={style.searchTokenInput}
            onChange={searchToken}
          />
          <div className={style.tokenListTitleRow}>
            <div>Token name</div>
          </div>
        </div>
        <div className={style.list}>{listItems(searchedList)}</div>
        <div className={style.tokenListSetting}>View Token List</div>
      </div>
    </div>
  );
};

export default TokenList;
