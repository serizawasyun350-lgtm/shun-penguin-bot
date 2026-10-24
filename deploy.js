import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

// 環境変数のチェック
if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
  console.error('【エラー】DISCORD_TOKEN または CLIENT_ID が環境変数に設定されていません！RenderのEnvironmentを確認してください。');
  process.exit(1);
}

// 1〜99個のコマンド名リスト（Gemini特選セレクション）
const commandNames = [
  // 1〜15: 基本挨拶・情報・管理
  'shun', 'ping', 'verify', 'userinfo', 'serverinfo', 'help', 'rules', 'membercount', 'botinfo', 'avatar',
  'kick', 'ban', 'clear', 'role-add', 'role-remove',
  
  // 16〜30: モデレーション・サーバー管理
  'mute', 'unmute', 'timeout', 'warn', 'warnings', 'lock', 'unlock', 'slowmode', 'announce', 'poll',
  'say', 'embed', 'nick', 'report', 'suggest',

  // 31〜60: お楽しみ・ミニゲーム・コミュニケーション
  'omikuji', 'dice', 'coinflip', 'slots', 'rps', 'gacha', 'hug', 'pat', 'kiss', 'slap',
  '8ball', 'rate', 'ascii', 'reverse', 'shufflemusic', 'wink', 'poke', 'tickle', 'cuddle', 'feed',
  'drink', 'cookie', 'coffee', 'tea', 'cake', 'pizza', 'chocolate', 'ship', 'tarot', 'horoscope',

  // 61〜97: 便利なユーティリティ機能
  'weather', 'calc', 'timer', 'remind', 'translate', 'memo', 'note', 'qr', 'define', 'wiki',
  'news', 'crypto', 'stock', 'color', 'password', 'uuid', 'math', 'ip', 'host', 'whois',
  'channelinfo', 'roleinfo', 'emojiinfo', 'boosters', 'invites', 'banner', 'icon', 'uptime', 'speedtest',
  'joke', 'fact', 'quote', 'lyrics', 'compatibility', 'zodiac', 'ping-web', 'ping-site',

  // 98個目: チケットパネル
  'ticket-panel',

  // 99個目: 認証パネル
  'verify-panel'
];

// リストから自動でSlashCommandBuilderを生成
const commands = commandNames.map((name, index) => {
  const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(`しゅん＆ぺんぎんさば用コマンド #${index + 1} (${name})`);

  // 管理系コマンドには必要な権限を自動付与
  if (['kick', 'ban', 'clear', 'role-add', 'role-remove', 'mute', 'unmute', 'timeout', 'warn', 'lock', 'unlock', 'slowmode', 'announce'].includes(name)) {
    builder.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
  }
  // パネル系や特殊コマンドは管理者のみ
  if (['ticket-panel', 'verify-panel', 'say', 'embed'].includes(name)) {
    builder.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
  }

  return builder.toJSON();
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`全 ${commands.length} 個のコマンドの登録を開始します...`);
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('スラッシュコマンドの登録が正常に完了しました！');
  } catch (error) {
    console.error('コマンド登録時にエラーが発生しました:', error);
  }
})();
