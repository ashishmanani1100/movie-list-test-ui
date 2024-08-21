import { useMemo } from "react";
import usePagination from "@mui/material/usePagination";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import BaseButton from "./BaseButton";

const List = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  alignItems: "center",
});

// Per page movie count
const RECORDS_PER_PAGE = 8;

// Common pagination
const Pagination = ({ totalCount, page, setPage }) => {
  const totalPageCount = useMemo(
    () => Math.ceil((totalCount ?? 0) / RECORDS_PER_PAGE),
    [totalCount]
  );

  const { items } = usePagination({
    count: totalPageCount,
    page,
  });

  return (
    totalCount && (
      <Box sx={{ marginInline: "auto" }}>
        <List>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = (
                <BaseButton
                  variant="outlined"
                  disabled={item.disabled}
                  styleProps={{
                    margin: "8px",
                    border: "none",
                    minWidth: "30px",
                    "&:hover": {
                      border: "none",
                    },
                  }}
                  size="small"
                >
                  …
                </BaseButton>
              );
            } else if (type === "page") {
              children = (
                <BaseButton
                  variant={selected ? "filled" : "outlined"}
                  type="button"
                  styleProps={{
                    margin: "8px",
                    borderWidth: "1px",
                    padding: "0",
                    minWidth: "30px",
                    fontWeight: selected ? "bold" : undefined,
                    ...(!selected ? { border: "1px solid transparent" } : {}),
                  }}
                  {...item}
                  onClick={() => {
                    setPage(page);
                  }}
                  size="small"
                >
                  {page}
                </BaseButton>
              );
            } else {
              children = (
                <BaseButton
                  type="button"
                  variant="outlined"
                  {...item}
                  styleProps={{
                    borderWidth: "1px",
                    minWidth: "30px",
                    margin: "8px",
                    border: "1px solid transparent",
                    textTransform: "capitalize",
                  }}
                  onClick={() => {
                    setPage((prevState) => {
                      const currentPage =
                        type === "previous"
                          ? prevState - 1
                          : type === "next"
                          ? prevState + 1
                          : page;
                      return currentPage;
                    });
                  }}
                  size="small"
                >
                  {type.slice(0, 4)}
                </BaseButton>
              );
            }

            return <li key={index}>{children}</li>;
          })}
        </List>
      </Box>
    )
  );
};

export default Pagination;
