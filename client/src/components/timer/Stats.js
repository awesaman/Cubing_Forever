import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import formatTime from '../../utils/formatTime';

const useStyles = makeStyles({
  scrollable: {
    minWidth: 200,
    maxHeight: 20,
    overflowY: 'auto',
  },
  tablecontainer: {
    overflowX: 'auto',
    marginTop: 10,
  },
  smallcol: {
    maxHeight: 20,
    minWidth: 90,
  },
  midcol: {
    maxHeight: 20,
    minWidth: 120,
  },
});

const Stats = ({
  bmo3,
  cmo3,
  bavg5,
  cavg5,
  bavg12,
  cavg12,
  best,
  worst,
  room,
}) => {
  const classes = useStyles();

  return (
    <TableContainer className={classes.tablecontainer} component={Paper}>
      <Table size='small' aria-label='a dense table'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell className={classes.scrollable}>Solves</TableCell>
            {cmo3 && (
              <TableCell className={classes.midcol}>Curr Mean 3</TableCell>
            )}
            {bmo3 && (
              <TableCell className={classes.midcol}>Best Mean 3</TableCell>
            )}
            {cavg5 && (
              <TableCell className={classes.midcol}>Curr Avg 5</TableCell>
            )}
            {bavg5 && (
              <TableCell className={classes.midcol}>Best Avg 5</TableCell>
            )}
            {cavg12 && (
              <TableCell className={classes.midcol}>Curr Avg 12</TableCell>
            )}
            {bavg12 && (
              <TableCell className={classes.midcol}>Best Avg 12</TableCell>
            )}
            {best && <TableCell className={classes.smallcol}>Best</TableCell>}
            {worst && <TableCell className={classes.smallcol}>Worst</TableCell>}
            <TableCell className={classes.smallcol}># Solves</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(room.stats).map((user, i) => (
            <TableRow key={Object.getOwnPropertyNames(room.stats)[i]}>
              <TableCell component='th' scope='row'>
                {Object.getOwnPropertyNames(room.stats)[i]}
              </TableCell>
              {room.stats[user].numsolves > 0 && (
                <TableCell className={classes.scrollable}>
                  {room.stats[user].solves
                    .slice(0)
                    .reverse()
                    .map((sol, j) => (
                      <span
                        key={j}
                        style={
                          sol.scramble === room.scramble
                            ? { fontSize: '1.5em' }
                            : {}
                        }
                      >
                        {formatTime(sol.time)}
                        {j !== room.stats[user].numsolves - 1 && ', '}
                      </span>
                    ))}
                </TableCell>
              )}
              {cmo3 && (
                <TableCell className={classes.midcol}>
                  {formatTime(room.stats[user].cmo3)}
                </TableCell>
              )}
              {bmo3 && (
                <TableCell className={classes.midcol}>
                  {formatTime(room.stats[user].bmo3)}
                </TableCell>
              )}
              {cavg5 && (
                <TableCell className={classes.midcol}>
                  {formatTime(room.stats[user].cavg5)}
                </TableCell>
              )}
              {bavg5 && (
                <TableCell className={classes.midcol}>
                  {formatTime(room.stats[user].bavg5)}
                </TableCell>
              )}
              {cavg12 && (
                <TableCell className={classes.midcol}>
                  {formatTime(room.stats[user].cavg12)}
                </TableCell>
              )}
              {bavg12 && (
                <TableCell className={classes.midcol}>
                  {formatTime(room.stats[user].bavg12)}
                </TableCell>
              )}
              {best && (
                <TableCell className={classes.smallcol}>
                  {formatTime(room.stats[user].best)}
                </TableCell>
              )}
              {worst && (
                <TableCell className={classes.smallcol}>
                  {formatTime(room.stats[user].worst)}
                </TableCell>
              )}
              <TableCell className={classes.smallcol}>
                {room.stats[user].numsolves}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

Stats.propTypes = {
  formatTime: PropTypes.func.isRequired,
  bmo3: PropTypes.bool.isRequired,
  cmo3: PropTypes.bool.isRequired,
  bavg5: PropTypes.bool.isRequired,
  cavg5: PropTypes.bool.isRequired,
  bavg12: PropTypes.bool.isRequired,
  cavg12: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  room: state.room,
});

export default connect(mapStateToProps)(Stats);
