package com.guardian.editions.ophan;

import android.content.Context;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.UUID;

public class InstallationIdHelper {

    @Nullable
    private String sID;
    private static final String INSTALLATION_FILE_NAME = "INSTALLATION";

    public InstallationIdHelper(@NonNull Context context){
        sID = readId(context);
    }

    @Nullable
    private synchronized String readId(@NonNull Context context) {
        if (sID == null) {
            File installation = new File(context.getFilesDir(), INSTALLATION_FILE_NAME);
            try {
                if (!installation.exists()) {
                    writeInstallationFile(installation);
                }
                return readInstallationFile(installation);
            } catch (Exception e) {
                Log.w("InstallationIdHelper", "Error reading Id from installation file", e);
            }
        }
        return sID;
    }

    @NotNull
    public synchronized String id() {
        if (sID == null) {
            throw new IllegalStateException("Installation.id has not been initialised");
        }
        return sID;
    }

    @NonNull
    private String readInstallationFile(File installation) throws IOException {
        RandomAccessFile f = new RandomAccessFile(installation, "r");
        byte[] bytes = new byte[(int) f.length()];
        f.readFully(bytes);
        f.close();
        return new String(bytes);
    }

    private void writeInstallationFile(@NonNull File installation) throws IOException {
        FileOutputStream out = new FileOutputStream(installation);
        String id = UUID.randomUUID().toString();
        out.write(id.getBytes());
        out.close();
    }
}