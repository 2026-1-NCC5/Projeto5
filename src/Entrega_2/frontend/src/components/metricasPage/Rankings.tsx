import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MetricasDashboard } from '@/types';
import styles from './Rankings.module.css';

interface RankingsProps {
  data: MetricasDashboard;
  limit?: number;
}

export function Rankings({ data, limit }: RankingsProps) {
  const { username, slug_projeto, slug_edicao } = useParams();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0 
    }).format(value);
  };

  const top_grupos_raw = data.ranking_grupos || [];
  const top_turmas_raw = data.ranking_turmas || [];

  const topGrupos = limit ? top_grupos_raw.slice(0, limit) : top_grupos_raw;
  const topTurmas = limit ? top_turmas_raw.slice(0, limit) : top_turmas_raw;

  const rankingFullUrl = `/${username}/${slug_projeto}/${slug_edicao}/metricas/ranking`;
  const isDashboard = limit !== undefined;

  return (
    <div className={styles.container}>
      {/* Ranking de Grupos */}
      <div className={styles.rankingBox}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {isDashboard ? `🏆 Top ${limit} Grupos` : '🏆 Ranking Geral de Grupos'}
          </h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.posCol}>Pos</th>
                <th>Grupo</th>
                <th>kg</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {topGrupos.map((grupo) => (
                <tr key={grupo.nome} className={grupo.posicao <= 3 ? styles[`top${grupo.posicao}`] : ''}>
                  <td className={styles.posCol}>
                    {grupo.posicao === 1 ? '🥇' : grupo.posicao === 2 ? '🥈' : grupo.posicao === 3 ? '🥉' : `${grupo.posicao}º`}
                  </td>
                  <td className={styles.nameCol}>{grupo.nome}</td>
                  <td>{(grupo.kg || 0).toFixed(1)}</td>
                  <td>{formatCurrency(grupo.valor || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isDashboard && (
          <Link href={rankingFullUrl} className={styles.viewMore}>
            Ver ranking completo →
          </Link>
        )}
      </div>

      {/* Ranking de Turmas */}
      <div className={styles.rankingBox}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {isDashboard ? `🏆 Top ${limit} Turmas` : '🏆 Ranking Geral de Turmas'}
          </h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.posCol}>Pos</th>
                <th>Turma</th>
                <th>kg</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {topTurmas.map((turma) => (
                <tr key={turma.nome} className={turma.posicao <= 3 ? styles[`top${turma.posicao}`] : ''}>
                  <td className={styles.posCol}>
                    {turma.posicao === 1 ? '🥇' : turma.posicao === 2 ? '🥈' : turma.posicao === 3 ? '🥉' : `${turma.posicao}º`}
                  </td>
                  <td className={styles.nameCol}>{turma.nome}</td>
                  <td>{(turma.kg || 0).toFixed(1)}</td>
                  <td>{formatCurrency(turma.valor || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isDashboard && (
          <Link href={rankingFullUrl} className={styles.viewMore}>
            Ver ranking completo →
          </Link>
        )}
      </div>
    </div>
  );
}
