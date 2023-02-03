import INFTPaginationProps from "../interfaces/INFTPaginationProps";

import styles from "../styles/Pagination.module.css";

export function NftPagination(props: any) {
  return (
    <div className={`${styles.pagination}`}>
      <p>
        Showing{" "}
        {props.total > props.nftPagination ? props.nftPagination : props.total}{" "}
        out of {props.total}{" "}
      </p>
      {props.total > props.nftPagination && (
        <button className="mt-2" onClick={props.handleNextPageChange}>
          Show More..
        </button>
      )}
    </div>
  );
}

export default NftPagination;
