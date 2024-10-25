/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import { Raid } from '../../data/raidsInfo';
import { faSkull, faUserNinja } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';
import raidsInfo from '../../data/raidsInfo';
import IconButton from '@mui/material/IconButton';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import imagesData from '@/data/imageLinks';
import FirstTimeModal from './FirstTimeModal';

interface RaidGridProps {
  raid: Raid;
  hasHardVersion: boolean;
  hasSoloVersion: boolean;
}

const RaidGrid: React.FC<RaidGridProps> = ({ raid, hasHardVersion, hasSoloVersion }) => {
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenRaidModal');
    if (!hasSeenModal) {
      setShowFirstTimeModal(true);
    }
  }, []);

  const handleCloseFirstTimeModal = () => {
    setShowFirstTimeModal(false);
    localStorage.setItem('hasSeenRaidModal', 'true');
  };

  const [dimmed, setDimmed] = useState<boolean[][] | null>(null);
  const [showDifferences, setShowDifferences] = useState<boolean>(false);

  const router = useRouter();

  const handleSkullClick = (newPath: string) => {
    const scrollPosition = window.pageYOffset;
    localStorage.setItem('scrollPosition', scrollPosition.toString());
    const baseRaidPath = raid.path.split('-')[0];
    localStorage.setItem(`raidPath_${baseRaidPath}`, newPath);
    router.push(newPath);
  };

  useEffect(() => {
    if (raid.gateData && raid.gateData.gold && raid.gateData.boxCost) {
      setDimmed([Array(raid.gateData.gold.length).fill(false), Array(raid.gateData.boxCost.length).fill(true)]);
    }
  }, [raid.gateData, raid.gateData.gold.length, raid.gateData.boxCost.length]);

  if (!dimmed || !raid.gateData) {
    return null;
  }

  const hardVersion = raidsInfo.find((r) => r.path === `${raid.path}-hard`);

  const displayValues = (rowIndex: number, columnIndex: number): string => {
    const category = rowIndex === 0 ? 'gold' : 'boxCost';
    const currentValues = raid.gateData[category].map(Number);
    const hardValues = hardVersion && hardVersion.gateData[category] ? hardVersion.gateData[category].map(Number) : [];

    if (!showDifferences || !hardVersion || columnIndex >= currentValues.length) {
      return currentValues[columnIndex].toString();
    } else {
      const diff = (hardValues[columnIndex] || 0) - currentValues[columnIndex];
      return `${currentValues[columnIndex]} (${diff >= 0 ? '+' : ''}${diff})`;
    }
  };

  const displayTotalValues = (rowIndex: number): string => {
    const values = raid.gateData?.[rowIndex === 0 ? 'gold' : 'boxCost'].map(Number) || [];
    const hardValues = hardVersion?.gateData?.[rowIndex === 0 ? 'gold' : 'boxCost'].map(Number) || [];

    // Use the lesser of the two lengths for safe operation
    const minGateCount = Math.min(values.length, hardValues.length);

    if (!showDifferences || !hardVersion) {
      return calculateTotal(values.slice(0, minGateCount), rowIndex).toString();
    } else {
      const totalHard = calculateTotal(hardValues.slice(0, minGateCount), rowIndex);
      const totalCurrent = calculateTotal(values.slice(0, minGateCount), rowIndex);
      const diff = totalHard - totalCurrent;
      return `${totalCurrent} (${diff >= 0 ? '+' : ''}${diff})`;
    }
  };

  const calculateTotal = (values: number[], rowIndex: number): number => {
    if (!dimmed || rowIndex >= dimmed.length || values.length !== dimmed[rowIndex].length) {
      return 0;
    }

    return values.reduce((acc, curr, index) => acc + (dimmed[rowIndex][index] ? 0 : curr), 0);
  };

  // Update total calculation calls by passing the row index
  const totalGold = raid.gateData ? calculateTotal(raid.gateData.gold, 0) : 0;
  const totalBoxCost = raid.gateData ? calculateTotal(raid.gateData.boxCost, 1) : 0;
  const goldEarned = totalGold - totalBoxCost;
  const rewardsFirstTotal = raid.gateData.gateRewards ? raid.gateData.gateRewards.reduce((acc, curr) => acc + curr[0], 0) : 0;
  const rewardsSecondTotal = raid.gateData.gateRewards
    ? raid.gateData.gateRewards.reduce((acc, curr) => {
      if (curr.length > 1) {
        return acc + curr[1];
      }
      return acc;
    }, 0)
    : 0;
  const honorShardsTotal = raid?.gateData?.honorShards?.reduce((total, shards) => total + shards, 0);
  const boxHonorShardsTotal = raid?.gateData?.boxHonorShards?.reduce((total, shards) => total + shards, 0);
  const chaosStonesTotal = raid?.gateData?.chaosStones?.reduce((total, stones) => total + stones, 0);
  const destructionStonesTotal = raid?.gateData?.destructionStones?.reduce((total, stones) => total + stones, 0);
  const boxDestructionStonesTotal = raid?.gateData?.boxDestructionStones?.reduce((total, stones) => total + stones, 0);

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    setDimmed((currentDimmed) => {
      if (currentDimmed === null) {
        return null;
      }

      const updatedRow = [...currentDimmed[rowIndex]];
      updatedRow[columnIndex] = !updatedRow[columnIndex];

      return [...currentDimmed.slice(0, rowIndex), updatedRow, ...currentDimmed.slice(rowIndex + 1)];
    });
  };

  const rows = [
    { category: 'Gold', values: raid.gateData.gold, total: totalGold },
    {
      category: 'Box Cost',
      values: raid.gateData.boxCost,
      total: totalBoxCost,
    },
  ];

  if (!raid.gateData || !dimmed.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-center w-full sm:px-4">
      <div className="flex flex-col items-center w-full">
        <img src={raid.imgSrc} alt={`${raid.label} Raid`} className="rounded-full w-48 h-48" />
        <h2 className="text-primary-text-label-color text-2xl flex">
          {raid.label} Raid
          {raid.path.endsWith('-hard') ? ' Hard' : raid.path.endsWith('-solo') ? ' Solo' : ''}{' '}
          <div className="flex flex-row h-8">
            {hasSoloVersion && (
              <Link href={raid.path.endsWith('-solo') ? raid.path.replace('-solo', '') : `${raid.path}-solo`}>
                <FontAwesomeIcon
                  icon={faUserNinja}
                  className={clsx('text-blue-500', 'ml-2', { 'opacity-25': !raid.path.endsWith('-solo') }, 'ninja-icon')}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSkullClick(raid.path.endsWith('-solo') ? raid.path.replace('-solo', '') : `${raid.path}-solo`);
                  }}
                />
              </Link>
            )}
            {hasHardVersion && (
              <Link href={raid.path.endsWith('-hard') ? raid.path.replace('-hard', '') : `${raid.path}-hard`}>
                <FontAwesomeIcon
                  icon={faSkull}
                  className={clsx('text-red-500', 'ml-2', { 'opacity-25': !raid.path.endsWith('-hard') }, 'skull-icon')}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSkullClick(raid.path.endsWith('-hard') ? raid.path.replace('-hard', '') : `${raid.path}-hard`);
                  }}
                />
              </Link>
            )}
            {!raid.path.endsWith('-hard') && !raid.path.endsWith('-solo') && hasHardVersion && (
              <IconButton
                onClick={() => setShowDifferences(!showDifferences)}
                aria-label="Show differences"
              >
                <CompareArrowsIcon
                  className={clsx('text-red-500', {
                    'opacity-25': !showDifferences,
                    'opacity-100': showDifferences,
                  })}
                />
              </IconButton>
            )}
          </div>
        </h2>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          backgroundColor: 'var(--chip-background-color)',
          color: 'var(--primary-text-color)',
          '.MuiTableCell-root': {
            color: 'var(--primary-text-color)',
            borderBottom: '2px solid var(--primary-text-label-color)',
            paddingLeft: 2,
            paddingRight: 2,
          },
          '& tr:nth-of-type(even)': {
            backgroundColor: 'var(--secondary-background-color)'
          }
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            {raid.gateData.itemLevels.length === 1 ? (
              <TableRow>
                <TableCell
                  colSpan={raid.gateData.gold.length + 2}
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    borderBottom: '2px solid var(--primary-text-label-color)',
                  }}
                >
                  Item Level: {raid.gateData.itemLevels[0]}
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '24px', width: '10%' }}>Category</TableCell>
              {raid.gateData.gold.map((_, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    width: `${90 / raid.gateData.gold.length}%`,
                    borderBottom: '2px solid var(--primary-text-label-color)',
                  }}
                >
                  Gate {index + 1}
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '24px',
                  width: '10%',
                  borderBottom: '2px solid var(--primary-text-label-color)',
                }}
              >
                Total
              </TableCell>
            </TableRow>
            {raid.gateData.itemLevels.length > 1 ? (
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    borderBottom: '2px solid var(--primary-text-label-color)',
                  }}
                >
                  Item Level
                </TableCell>
                {raid.gateData.itemLevels.map((level, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '24px',
                      borderBottom: '2px solid var(--primary-text-label-color)',
                    }}
                  >
                    {level}
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    borderBottom: '2px solid var(--primary-text-label-color)',
                  }}
                ></TableCell>
              </TableRow>
            ) : null}
          </TableHead>

          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  {row.category}
                </TableCell>
                {row.values.map((value, columnIndex) => (
                  <TableCell
                    key={columnIndex}
                    align="center"
                    className={row.category === 'Box Cost' && columnIndex >= 0 ? 'box-cost-cell' : ''}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        opacity: dimmed[rowIndex][columnIndex] ? 0.5 : 1,
                        cursor: 'pointer',
                        transition: 'opacity 0.3s ease',
                      }}
                      onClick={() => handleCellClick(rowIndex, columnIndex)}
                    >
                      {showDifferences ? displayValues(rowIndex, columnIndex) : value}
                      <img
                        src="https://i.imgur.com/DI98qp1.png"
                        alt="Gold Icon"
                        style={{
                          width: '20px',
                          marginRight: '5px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  className={row.category === 'Box Cost' ? 'box-cost-cell' : ''}
                  sx={{
                    borderBottom: '2px solid var(--primary-text-label-color)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {showDifferences ? displayTotalValues(rowIndex) : row.total}
                    <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginRight: '5px' }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {/* Gold Earnable row */}
            <TableRow>
              <TableCell colSpan={raid.gateData.gold.length + 2} align="center" sx={{ fontWeight: 'bold', fontSize: '24px' }}>
                Gold Earnable: {goldEarned}
              </TableCell>
            </TableRow>
            {raid.gateRewardImgSrc && (
              <TableRow>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  Rewards Clear/Box
                </TableCell>
                {raid.gateData.gateRewards &&
              raid.gateData.gateRewards.map((rewards, index) => (
                <TableCell key={index}>
                  <div className="raid-table-cell min-w-max">
                    {rewards.map((reward, rewardIndex) => (
                      <div
                        key={rewardIndex}
                        className="reward-cell flex flex-row flex-shrink-0 justify-center items-center text-2xl w-fit"
                      >
                        <div className="reward-count">{reward}</div>
                        <Tooltip title={`${raid.gateRewardImgToolTip && raid.gateRewardImgToolTip[0][rewardIndex]}`} placement="top">
                          <img
                            src={raid.gateRewardImgSrc && raid.gateRewardImgSrc[0][rewardIndex]}
                            alt={raid.gateRewardImgToolTip && raid.gateRewardImgToolTip[0][rewardIndex]}
                            className="reward-img"
                          />
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </TableCell>
              ))}
                <TableCell>
                  <div className="raid-table-cell min-w-max">
                    <div className="reward-cell flex flex-row flex-shrink-0 justify-center items-center text-2xl w-fit">
                      <div className="reward-count">{rewardsFirstTotal}</div>
                      <img
                        src={raid.gateRewardImgSrc && raid.gateRewardImgSrc[0][0]}
                        alt={raid.gateRewardImgToolTip && raid.gateRewardImgToolTip[0][0]}
                        title={raid.gateRewardImgToolTip && raid.gateRewardImgToolTip[0][0]}
                        className="reward-img"
                      />
                    </div>
                  </div>
                  {rewardsSecondTotal > 0 && (
                    <div className="raid-table-cell min-w-max">
                      <div className="reward-cell flex flex-row flex-shrink-0 justify-center items-center text-2xl w-fit">
                        <div className="reward-count">{rewardsSecondTotal}</div>
                        <img
                          src={raid.gateRewardImgSrc && raid.gateRewardImgSrc[0][1]}
                          alt={raid.gateRewardImgToolTip && raid.gateRewardImgToolTip[0][1]}
                          title={raid.gateRewardImgToolTip && raid.gateRewardImgToolTip[0][1]}
                          className="reward-img"
                        />
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
            {raid.gateData.clearMedal && (
              <TableRow>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  Clear Medals
                </TableCell>
                {raid.gateData.clearMedal.map((medals, index) => (
                  <TableCell key={index} align="center" sx={{ fontSize: '24px' }}>
                    <div className="flex flex-row raid-table-cell-row">
                      <div className="reward-count">{medals}</div>
                      <Tooltip title="Clear Medal" placement="top">
                        <img src={imagesData.clearMedal} alt="Clear Medal" className="honor-shard-img" />
                      </Tooltip>
                    </div>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontSize: '24px' }} className="min-w-max">
                  <div className="flex flex-row raid-table-cell-row min-w-max">
                    <div className="reward-count">{raid.gateData.clearMedal.reduce((a, b) => a + b, 0)}</div>
                    <Tooltip title="Clear Medal" placement="top">
                      <img src={imagesData.clearMedal} alt="Clear Medal" className="honor-shard-img" />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {/* Row for Honor Shards Normal Clear */}
            {raid?.gateData?.honorShards && (
              <TableRow className="min-w-max">
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  Shards
                </TableCell>
                {raid?.gateData?.honorShards?.map((shards, index) => (
                  <TableCell key={index} align="center" sx={{ fontSize: '24px' }}>
                    <div className="flex flex-row raid-table-cell-row">
                      <div className="reward-count">{shards}</div>
                      <Tooltip title="Honor Shard" placement="top">
                        <img src={imagesData.honorShards} alt="Honor Shard" className="honor-shard-img" />
                      </Tooltip>
                    </div>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontSize: '24px' }} className="min-w-max">
                  <div className="flex flex-row raid-table-cell-row min-w-max">
                    <div className="reward-count">{honorShardsTotal}</div>
                    <Tooltip title="Honor Shard" placement="top">
                      <img src={imagesData.honorShards} alt="Honor Shard" className="honor-shard-img" />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Row for Honor Shards Box Clear */}
            {raid?.gateData?.boxHonorShards && (
              <TableRow className="min-w-max">
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  Box Shards
                </TableCell>
                {raid?.gateData?.boxHonorShards?.map((shards, index) => (
                  <TableCell key={index} align="center" sx={{ fontSize: '24px' }}>
                    <div className="flex flex-row raid-table-cell-row">
                      <div className="reward-count">{shards}</div>
                      <Tooltip title="Honor Shard" placement="top">
                        <img src={imagesData.honorShards} alt="Honor Shard" className="honor-shard-img" />
                      </Tooltip>
                    </div>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontSize: '24px' }} className="min-w-max">
                  <div className="flex flex-row raid-table-cell-row min-w-max">
                    <div className="reward-count">{boxHonorShardsTotal}</div>
                    <Tooltip title="Honor Shard" placement="top">
                      <img src={imagesData.honorShards} alt="Honor Shard" className="honor-shard-img" />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Shards Earnable row */}
            {(raid?.gateData?.honorShards || raid?.gateData?.boxHonorShards) && (
              <TableRow>
                <TableCell colSpan={raid.gateData.gold.length + 2} align="center" sx={{ fontWeight: 'bold', fontSize: '24px' }}>
                  Honor Shards Earnable: {(honorShardsTotal ?? 0) + (boxHonorShardsTotal ?? 0)}
                </TableCell>
              </TableRow>
            )}
            {/* Chaos Stones Row Total */}
            {chaosStonesTotal && chaosStonesTotal > 0 && (
              <TableRow className="min-w-max">
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  Chaos Stones
                </TableCell>
                {raid?.gateData?.chaosStones?.map((stones, index) => (
                  <TableCell key={index} align="center" sx={{ fontSize: '24px' }}>
                    {stones > 0 && (
                      <div className="flex flex-row raid-table-cell-row">
                        <div className="reward-count">{stones}</div>
                        <Tooltip title="Chaos Stone" placement="top">
                          <img src={imagesData.chaosStones} alt="Chaos Stones" className="honor-shard-img" />
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontSize: '24px' }} className="min-w-max">
                  <div className="flex flex-row raid-table-cell-row min-w-max">
                    <div className="reward-count">{chaosStonesTotal}</div>
                    <Tooltip title="Chaos Stone" placement="top">
                      <img src={imagesData.chaosStones} alt="Chaos Stone" className="honor-shard-img" />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {/* Destruction Stones Row Total */}
            {destructionStonesTotal && destructionStonesTotal > 0 && (
              <TableRow className="min-w-max">
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  Destruction Stones
                </TableCell>
                {raid?.gateData?.destructionStones?.map((stones, index) => (
                  <TableCell key={index} align="center" sx={{ fontSize: '24px' }}>
                    {stones > 0 && (
                      <div className="flex flex-row raid-table-cell-row">
                        <div className="reward-count">{stones}</div>
                        <Tooltip title="Destruction Stone" placement="top">
                          <img src={imagesData.destructionStones} alt="Destruction Stones" className="honor-shard-img" />
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontSize: '24px' }} className="min-w-max">
                  <div className="flex flex-row raid-table-cell-row min-w-max">
                    <div className="reward-count">{destructionStonesTotal}</div>
                    <Tooltip title="Destruction Stone" placement="top">
                      <img src={imagesData.destructionStones} alt="Destruction Stones" className="honor-shard-img" />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Box Destruction Stones Row Total */}
            {raid?.gateData?.boxDestructionStones && (
              <TableRow className="min-w-max">
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  Box Destruction Stones
                </TableCell>
                {raid?.gateData?.boxDestructionStones?.map((stones, index) => (
                  <TableCell key={index} align="center" sx={{ fontSize: '24px' }}>
                    {stones > 0 && (
                      <div className="flex flex-row raid-table-cell-row">
                        <div className="reward-count">{stones}</div>
                        <Tooltip title="Destruction Stone" placement="top">
                          <img src={imagesData.destructionStones} alt="Destruction Stones" className="honor-shard-img" />
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontSize: '24px' }} className="min-w-max">
                  <div className="flex flex-row raid-table-cell-row min-w-max">
                    <div className="reward-count">{boxDestructionStonesTotal}</div>
                    <Tooltip title="Destruction Stone" placement="top">
                      <img src={imagesData.destructionStones} alt="Destruction Stones" className="honor-shard-img" />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Destruction Stones Earnable row */}
            {(raid?.gateData?.destructionStones || raid?.gateData?.boxDestructionStones) && (
              <TableRow>
                <TableCell colSpan={raid.gateData.gold.length + 2} align="center" sx={{ fontWeight: 'bold', fontSize: '24px' }}>
                  Destruction Stones Earnable:{' '}
                  {(destructionStonesTotal ?? 0) +
                (raid?.gateData?.boxDestructionStones?.reduce((total, stones) => total + stones, 0) ?? 0)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <FirstTimeModal open={showFirstTimeModal} onClose={handleCloseFirstTimeModal} />
    </div>
  );
};

export default RaidGrid;
