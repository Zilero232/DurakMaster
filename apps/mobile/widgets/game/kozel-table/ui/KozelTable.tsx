import { isKozelTrump } from '@durak-master/game-core';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeaveCorner, PlayerHand, TableBar, TrickField, TrickSeats } from '@/entities/game-table';
import { useKozelGame } from '@/entities/session';
import { useTableLook } from '@/entities/settings';
import { Button, ContentWidth, FeltBackground, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { KozelTableProps } from './KozelTable.types';

import { styles } from './KozelTable.styles';

export const KozelTable = ({ settings, onLeave }: KozelTableProps) => {
  const game = useKozelGame();
  const { view } = game;
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const { cardScale, handSort, showHints, isInstant } = useTableLook();

  return (
    <FeltBackground style={styles.root}>
      <ContentWidth
        maxWidth={TABLE_MAX_WIDTH}
        style={[styles.table, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <LeaveCorner onLeave={onLeave} />

        <TrickSeats
          activeSeat={view?.activeSeat ?? -1}
          isDealt={view?.phase === 'playing'}
          leadSeat={view?.leadSeat ?? 0}
          mySeat={game.mySeat}
          players={game.seats}
          profiles={game.players}
          readyUserIds={game.readyUserIds}
          turnDeadline={view?.turnDeadline ?? null}
          turnSeconds={settings.turnTimeoutSeconds}
        />

        {game.isChoosingLeader ? (
          <View style={styles.choiceArea}>
            <View style={styles.choice}>
              <Text style={styles.choiceTitle}>{t('games.kozel.chooseLeaderTitle')}</Text>

              {game.canChooseLeader ? (
                <View style={styles.choiceButtons}>
                  <Button variant='primary' onPress={() => game.chooseLeader(game.mySeat)}>
                    {t('games.kozel.chooseLeaderMe')}
                  </Button>

                  <Button variant='ghost' onPress={() => game.chooseLeader(game.partnerSeat)}>
                    {t('games.kozel.chooseLeaderPartner')}
                  </Button>
                </View>
              ) : (
                <Text style={styles.choiceHint}>{t('games.kozel.chooseLeaderWait')}</Text>
              )}
            </View>
          </View>
        ) : (
          <TrickField
            plays={(view?.trick ?? []).map((entry) => ({
              seat: entry.seat,
              cards: [entry.card]
            }))}
            cardScale={cardScale}
            isInstant={isInstant}
            mySeat={game.mySeat}
          />
        )}

        <View style={styles.score}>
          <View style={styles.team}>
            <Text style={styles.teamLabel}>{t('games.kozel.yourTeam')}</Text>
            <Text style={[styles.teamValue, styles.mine]}>{view?.myTeamPoints ?? 0}</Text>
          </View>

          <View style={styles.team}>
            <Text style={styles.teamLabel}>{t('games.kozel.opponents')}</Text>
            <Text style={styles.teamValue}>{view?.opponentPoints ?? 0}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <PlayerHand
            cards={view?.hand ?? []}
            cardScale={cardScale}
            hasHints={showHints}
            isInstant={isInstant}
            playableKeys={game.playableKeys}
            sortMode={handSort}
            trump={isKozelTrump}
            onSelect={game.playCard}
          />

          <TableBar
            hasFreeSeat={game.hasFreeSeat}
            isMyTurn={game.isMyTurn}
            isReady={game.isReady}
            isWaiting={game.isWaiting}
            profile={game.profile}
            turnDeadline={view?.turnDeadline ?? null}
            turnSeconds={settings.turnTimeoutSeconds}
            onAddBot={game.addBot}
            onOpenEmojis={() => undefined}
            onReady={game.setReady}
          />
        </View>
      </ContentWidth>
    </FeltBackground>
  );
};
