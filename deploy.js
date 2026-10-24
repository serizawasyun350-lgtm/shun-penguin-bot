import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

// 環境変数が設定されているかチェックする安全装置
if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
  console.error('【エラー】DISCORD_TOKEN または CLIENT_ID が環境変数に設定されていません！RenderのEnvironmentを確認してください。');
  process.exit(1);
}

const commands = [
  // 1〜10番目の基本・管理コマンド
  new SlashCommandBuilder().setName('shun').setDescription('しゅん＆ぺんぎんさばのあいさつ').toJSON(),
  new SlashCommandBuilder().setName('ping').setDescription('Botの応答速度を確認').toJSON(),
  new SlashCommandBuilder().setName('verify').setDescription('手動認証を実行').toJSON(),
  new SlashCommandBuilder().setName('userinfo').setDescription('ユーザー情報を取得').toJSON(),
  new SlashCommandBuilder().setName('serverinfo').setDescription('サーバー情報を取得').toJSON(),
  new SlashCommandBuilder().setName('kick').setDescription('メンバーをキック').setDefaultMemberPermissions(PermissionFlagsBits.KickMembers).toJSON(),
  new SlashCommandBuilder().setName('ban').setDescription('メンバーをBAN').setDefaultMemberPermissions(PermissionFlagsBits.BanMembers).toJSON(),
  new SlashCommandBuilder().setName('clear').setDescription('メッセージを一括削除').setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages).toJSON(),
  new SlashCommandBuilder().setName('role-add').setDescription('ロールを付与').setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles).toJSON(),
  new SlashCommandBuilder().setName('role-remove').setDescription('ロールを解除').setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles).toJSON(),
];

// コマンド数が97個になるまでループで埋め合わせ（計97個）
for (let i = commands.length + 1; i <= 97; i++) {
  commands.push(
    new SlashCommandBuilder()
      .setName(`cmd-${i}`)
      .setDescription(`しゅん＆ぺんぎんさば用コマンド ${i}`)
      .toJSON()
  );
}

// 98個目: チケットパネル設置コマンド
commands.push(
  new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('お問い合わせチケット発行パネルを設置します')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON()
);

// 99個目: 認証パネル設置コマンド
commands.push(
  new SlashCommandBuilder()
    .setName('verify-panel')
    .setDescription('サーバー参加者用の認証ボタンパネルを設置します')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON()
);

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
