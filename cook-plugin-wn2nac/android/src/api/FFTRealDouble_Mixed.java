/*
 * Decompiled with CFR 0_110.
 */
package ch.skywatch.windoo.api;

class FFTRealDouble_Mixed {
    FFTRealDouble_Mixed() {
    }

    void radf2(int ido, int l1, double[] cc, double[] ch, double[] wtable, int offset) {
        int k;
        int iw1 = offset;
        for (k = 0; k < l1; ++k) {
            ch[2 * k * ido] = cc[k * ido] + cc[(k + l1) * ido];
            ch[(2 * k + 1) * ido + ido - 1] = cc[k * ido] - cc[(k + l1) * ido];
        }
        if (ido < 2) {
            return;
        }
        if (ido != 2) {
            for (k = 0; k < l1; ++k) {
                for (int i = 2; i < ido; i += 2) {
                    int ic = ido - i;
                    double tr2 = wtable[i - 2 + iw1] * cc[i - 1 + (k + l1) * ido] + wtable[i - 1 + iw1] * cc[i + (k + l1) * ido];
                    double ti2 = wtable[i - 2 + iw1] * cc[i + (k + l1) * ido] - wtable[i - 1 + iw1] * cc[i - 1 + (k + l1) * ido];
                    ch[i + 2 * k * ido] = cc[i + k * ido] + ti2;
                    ch[ic + (2 * k + 1) * ido] = ti2 - cc[i + k * ido];
                    ch[i - 1 + 2 * k * ido] = cc[i - 1 + k * ido] + tr2;
                    ch[ic - 1 + (2 * k + 1) * ido] = cc[i - 1 + k * ido] - tr2;
                }
            }
            if (ido % 2 == 1) {
                return;
            }
        }
        for (k = 0; k < l1; ++k) {
            ch[(2 * k + 1) * ido] = - cc[ido - 1 + (k + l1) * ido];
            ch[ido - 1 + 2 * k * ido] = cc[ido - 1 + k * ido];
        }
    }

    void radb2(int ido, int l1, double[] cc, double[] ch, double[] wtable, int offset) {
        int k;
        int iw1 = offset;
        for (k = 0; k < l1; ++k) {
            ch[k * ido] = cc[2 * k * ido] + cc[ido - 1 + (2 * k + 1) * ido];
            ch[(k + l1) * ido] = cc[2 * k * ido] - cc[ido - 1 + (2 * k + 1) * ido];
        }
        if (ido < 2) {
            return;
        }
        if (ido != 2) {
            for (k = 0; k < l1; ++k) {
                for (int i = 2; i < ido; i += 2) {
                    int ic = ido - i;
                    ch[i - 1 + k * ido] = cc[i - 1 + 2 * k * ido] + cc[ic - 1 + (2 * k + 1) * ido];
                    double tr2 = cc[i - 1 + 2 * k * ido] - cc[ic - 1 + (2 * k + 1) * ido];
                    ch[i + k * ido] = cc[i + 2 * k * ido] - cc[ic + (2 * k + 1) * ido];
                    double ti2 = cc[i + 2 * k * ido] + cc[ic + (2 * k + 1) * ido];
                    ch[i - 1 + (k + l1) * ido] = wtable[i - 2 + iw1] * tr2 - wtable[i - 1 + iw1] * ti2;
                    ch[i + (k + l1) * ido] = wtable[i - 2 + iw1] * ti2 + wtable[i - 1 + iw1] * tr2;
                }
            }
            if (ido % 2 == 1) {
                return;
            }
        }
        for (k = 0; k < l1; ++k) {
            ch[ido - 1 + k * ido] = 2.0 * cc[ido - 1 + 2 * k * ido];
            ch[ido - 1 + (k + l1) * ido] = -2.0 * cc[(2 * k + 1) * ido];
        }
    }

    void radf3(int ido, int l1, double[] cc, double[] ch, double[] wtable, int offset) {
        double cr2;
        int k;
        double taur = -0.5;
        double taui = 0.866025403784439;
        int iw1 = offset;
        int iw2 = iw1 + ido;
        for (k = 0; k < l1; ++k) {
            cr2 = cc[(k + l1) * ido] + cc[(k + 2 * l1) * ido];
            ch[3 * k * ido] = cc[k * ido] + cr2;
            ch[(3 * k + 2) * ido] = 0.866025403784439 * (cc[(k + l1 * 2) * ido] - cc[(k + l1) * ido]);
            ch[ido - 1 + (3 * k + 1) * ido] = cc[k * ido] + -0.5 * cr2;
        }
        if (ido == 1) {
            return;
        }
        for (k = 0; k < l1; ++k) {
            for (int i = 2; i < ido; i += 2) {
                int ic = ido - i;
                double dr2 = wtable[i - 2 + iw1] * cc[i - 1 + (k + l1) * ido] + wtable[i - 1 + iw1] * cc[i + (k + l1) * ido];
                double di2 = wtable[i - 2 + iw1] * cc[i + (k + l1) * ido] - wtable[i - 1 + iw1] * cc[i - 1 + (k + l1) * ido];
                double dr3 = wtable[i - 2 + iw2] * cc[i - 1 + (k + l1 * 2) * ido] + wtable[i - 1 + iw2] * cc[i + (k + l1 * 2) * ido];
                double di3 = wtable[i - 2 + iw2] * cc[i + (k + l1 * 2) * ido] - wtable[i - 1 + iw2] * cc[i - 1 + (k + l1 * 2) * ido];
                cr2 = dr2 + dr3;
                double ci2 = di2 + di3;
                ch[i - 1 + 3 * k * ido] = cc[i - 1 + k * ido] + cr2;
                ch[i + 3 * k * ido] = cc[i + k * ido] + ci2;
                double tr2 = cc[i - 1 + k * ido] + -0.5 * cr2;
                double ti2 = cc[i + k * ido] + -0.5 * ci2;
                double tr3 = 0.866025403784439 * (di2 - di3);
                double ti3 = 0.866025403784439 * (dr3 - dr2);
                ch[i - 1 + (3 * k + 2) * ido] = tr2 + tr3;
                ch[ic - 1 + (3 * k + 1) * ido] = tr2 - tr3;
                ch[i + (3 * k + 2) * ido] = ti2 + ti3;
                ch[ic + (3 * k + 1) * ido] = ti3 - ti2;
            }
        }
    }

    void radb3(int ido, int l1, double[] cc, double[] ch, double[] wtable, int offset) {
        double cr2;
        double ci3;
        int k;
        double tr2;
        double taur = -0.5;
        double taui = 0.866025403784439;
        int iw1 = offset;
        int iw2 = iw1 + ido;
        for (k = 0; k < l1; ++k) {
            tr2 = 2.0 * cc[ido - 1 + (3 * k + 1) * ido];
            cr2 = cc[3 * k * ido] + -0.5 * tr2;
            ch[k * ido] = cc[3 * k * ido] + tr2;
            ci3 = 1.732050807568878 * cc[(3 * k + 2) * ido];
            ch[(k + l1) * ido] = cr2 - ci3;
            ch[(k + 2 * l1) * ido] = cr2 + ci3;
        }
        if (ido == 1) {
            return;
        }
        for (k = 0; k < l1; ++k) {
            for (int i = 2; i < ido; i += 2) {
                int ic = ido - i;
                tr2 = cc[i - 1 + (3 * k + 2) * ido] + cc[ic - 1 + (3 * k + 1) * ido];
                cr2 = cc[i - 1 + 3 * k * ido] + -0.5 * tr2;
                ch[i - 1 + k * ido] = cc[i - 1 + 3 * k * ido] + tr2;
                double ti2 = cc[i + (3 * k + 2) * ido] - cc[ic + (3 * k + 1) * ido];
                double ci2 = cc[i + 3 * k * ido] + -0.5 * ti2;
                ch[i + k * ido] = cc[i + 3 * k * ido] + ti2;
                double cr3 = 0.866025403784439 * (cc[i - 1 + (3 * k + 2) * ido] - cc[ic - 1 + (3 * k + 1) * ido]);
                ci3 = 0.866025403784439 * (cc[i + (3 * k + 2) * ido] + cc[ic + (3 * k + 1) * ido]);
                double dr2 = cr2 - ci3;
                double dr3 = cr2 + ci3;
                double di2 = ci2 + cr3;
                double di3 = ci2 - cr3;
                ch[i - 1 + (k + l1) * ido] = wtable[i - 2 + iw1] * dr2 - wtable[i - 1 + iw1] * di2;
                ch[i + (k + l1) * ido] = wtable[i - 2 + iw1] * di2 + wtable[i - 1 + iw1] * dr2;
                ch[i - 1 + (k + 2 * l1) * ido] = wtable[i - 2 + iw2] * dr3 - wtable[i - 1 + iw2] * di3;
                ch[i + (k + 2 * l1) * ido] = wtable[i - 2 + iw2] * di3 + wtable[i - 1 + iw2] * dr3;
            }
        }
    }

    void radf4(int ido, int l1, double[] cc, double[] ch, double[] wtable, int offset) {
        double ti1;
        double tr1;
        int k;
        double tr2;
        double hsqt2 = 0.7071067811865475;
        int iw1 = offset;
        int iw2 = offset + ido;
        int iw3 = iw2 + ido;
        for (k = 0; k < l1; ++k) {
            tr1 = cc[(k + l1) * ido] + cc[(k + 3 * l1) * ido];
            tr2 = cc[k * ido] + cc[(k + 2 * l1) * ido];
            ch[4 * k * ido] = tr1 + tr2;
            ch[ido - 1 + (4 * k + 3) * ido] = tr2 - tr1;
            ch[ido - 1 + (4 * k + 1) * ido] = cc[k * ido] - cc[(k + 2 * l1) * ido];
            ch[(4 * k + 2) * ido] = cc[(k + 3 * l1) * ido] - cc[(k + l1) * ido];
        }
        if (ido < 2) {
            return;
        }
        if (ido != 2) {
            for (k = 0; k < l1; ++k) {
                for (int i = 2; i < ido; i += 2) {
                    int ic = ido - i;
                    double cr2 = wtable[i - 2 + iw1] * cc[i - 1 + (k + l1) * ido] + wtable[i - 1 + iw1] * cc[i + (k + l1) * ido];
                    double ci2 = wtable[i - 2 + iw1] * cc[i + (k + l1) * ido] - wtable[i - 1 + iw1] * cc[i - 1 + (k + l1) * ido];
                    double cr3 = wtable[i - 2 + iw2] * cc[i - 1 + (k + 2 * l1) * ido] + wtable[i - 1 + iw2] * cc[i + (k + 2 * l1) * ido];
                    double ci3 = wtable[i - 2 + iw2] * cc[i + (k + 2 * l1) * ido] - wtable[i - 1 + iw2] * cc[i - 1 + (k + 2 * l1) * ido];
                    double cr4 = wtable[i - 2 + iw3] * cc[i - 1 + (k + 3 * l1) * ido] + wtable[i - 1 + iw3] * cc[i + (k + 3 * l1) * ido];
                    double ci4 = wtable[i - 2 + iw3] * cc[i + (k + 3 * l1) * ido] - wtable[i - 1 + iw3] * cc[i - 1 + (k + 3 * l1) * ido];
                    tr1 = cr2 + cr4;
                    double tr4 = cr4 - cr2;
                    ti1 = ci2 + ci4;
                    double ti4 = ci2 - ci4;
                    double ti2 = cc[i + k * ido] + ci3;
                    double ti3 = cc[i + k * ido] - ci3;
                    tr2 = cc[i - 1 + k * ido] + cr3;
                    double tr3 = cc[i - 1 + k * ido] - cr3;
                    ch[i - 1 + 4 * k * ido] = tr1 + tr2;
                    ch[ic - 1 + (4 * k + 3) * ido] = tr2 - tr1;
                    ch[i + 4 * k * ido] = ti1 + ti2;
                    ch[ic + (4 * k + 3) * ido] = ti1 - ti2;
                    ch[i - 1 + (4 * k + 2) * ido] = ti4 + tr3;
                    ch[ic - 1 + (4 * k + 1) * ido] = tr3 - ti4;
                    ch[i + (4 * k + 2) * ido] = tr4 + ti3;
                    ch[ic + (4 * k + 1) * ido] = tr4 - ti3;
                }
            }
            if (ido % 2 == 1) {
                return;
            }
        }
        for (k = 0; k < l1; ++k) {
            ti1 = -0.7071067811865475 * (cc[ido - 1 + (k + l1) * ido] + cc[ido - 1 + (k + 3 * l1) * ido]);
            tr1 = 0.7071067811865475 * (cc[ido - 1 + (k + l1) * ido] - cc[ido - 1 + (k + 3 * l1) * ido]);
            ch[ido - 1 + 4 * k * ido] = tr1 + cc[ido - 1 + k * ido];
            ch[ido - 1 + (4 * k + 2) * ido] = cc[ido - 1 + k * ido] - tr1;
            ch[(4 * k + 1) * ido] = ti1 - cc[ido - 1 + (k + 2 * l1) * ido];
            ch[(4 * k + 3) * ido] = ti1 + cc[ido - 1 + (k + 2 * l1) * ido];
        }
    }

    void radb4(int ido, int l1, double[] cc, double[] ch, double[] wtable, int offset) {
        double ti1;
        double tr1;
        double tr4;
        int k;
        double tr2;
        double ti2;
        double tr3;
        double sqrt2 = 1.414213562373095;
        int iw1 = offset;
        int iw2 = iw1 + ido;
        int iw3 = iw2 + ido;
        for (k = 0; k < l1; ++k) {
            tr1 = cc[4 * k * ido] - cc[ido - 1 + (4 * k + 3) * ido];
            tr2 = cc[4 * k * ido] + cc[ido - 1 + (4 * k + 3) * ido];
            tr3 = cc[ido - 1 + (4 * k + 1) * ido] + cc[ido - 1 + (4 * k + 1) * ido];
            tr4 = cc[(4 * k + 2) * ido] + cc[(4 * k + 2) * ido];
            ch[k * ido] = tr2 + tr3;
            ch[(k + l1) * ido] = tr1 - tr4;
            ch[(k + 2 * l1) * ido] = tr2 - tr3;
            ch[(k + 3 * l1) * ido] = tr1 + tr4;
        }
        if (ido < 2) {
            return;
        }
        if (ido != 2) {
            for (k = 0; k < l1; ++k) {
                for (int i = 2; i < ido; i += 2) {
                    int ic = ido - i;
                    ti1 = cc[i + 4 * k * ido] + cc[ic + (4 * k + 3) * ido];
                    ti2 = cc[i + 4 * k * ido] - cc[ic + (4 * k + 3) * ido];
                    double ti3 = cc[i + (4 * k + 2) * ido] - cc[ic + (4 * k + 1) * ido];
                    tr4 = cc[i + (4 * k + 2) * ido] + cc[ic + (4 * k + 1) * ido];
                    tr1 = cc[i - 1 + 4 * k * ido] - cc[ic - 1 + (4 * k + 3) * ido];
                    tr2 = cc[i - 1 + 4 * k * ido] + cc[ic - 1 + (4 * k + 3) * ido];
                    double ti4 = cc[i - 1 + (4 * k + 2) * ido] - cc[ic - 1 + (4 * k + 1) * ido];
                    tr3 = cc[i - 1 + (4 * k + 2) * ido] + cc[ic - 1 + (4 * k + 1) * ido];
                    ch[i - 1 + k * ido] = tr2 + tr3;
                    double cr3 = tr2 - tr3;
                    ch[i + k * ido] = ti2 + ti3;
                    double ci3 = ti2 - ti3;
                    double cr2 = tr1 - tr4;
                    double cr4 = tr1 + tr4;
                    double ci2 = ti1 + ti4;
                    double ci4 = ti1 - ti4;
                    ch[i - 1 + (k + l1) * ido] = wtable[i - 2 + iw1] * cr2 - wtable[i - 1 + iw1] * ci2;
                    ch[i + (k + l1) * ido] = wtable[i - 2 + iw1] * ci2 + wtable[i - 1 + iw1] * cr2;
                    ch[i - 1 + (k + 2 * l1) * ido] = wtable[i - 2 + iw2] * cr3 - wtable[i - 1 + iw2] * ci3;
                    ch[i + (k + 2 * l1) * ido] = wtable[i - 2 + iw2] * ci3 + wtable[i - 1 + iw2] * cr3;
                    ch[i - 1 + (k + 3 * l1) * ido] = wtable[i - 2 + iw3] * cr4 - wtable[i - 1 + iw3] * ci4;
                    ch[i + (k + 3 * l1) * ido] = wtable[i - 2 + iw3] * ci4 + wtable[i - 1 + iw3] * cr4;
                }
            }
            if (ido % 2 == 1) {
                return;
            }
        }
        for (k = 0; k < l1; ++k) {
            ti1 = cc[(4 * k + 1) * ido] + cc[(4 * k + 3) * ido];
            ti2 = cc[(4 * k + 3) * ido] - cc[(4 * k + 1) * ido];
            tr1 = cc[ido - 1 + 4 * k * ido] - cc[ido - 1 + (4 * k + 2) * ido];
            tr2 = cc[ido - 1 + 4 * k * ido] + cc[ido - 1 + (4 * k + 2) * ido];
            ch[ido - 1 + k * ido] = tr2 + tr2;
            ch[ido - 1 + (k + l1) * ido] = 1.414213562373095 * (tr1 - ti1);
            ch[ido - 1 + (k + 2 * l1) * ido] = ti2 + ti2;
            ch[ido - 1 + (k + 3 * l1) * ido] = -1.414213562373095 * (tr1 + ti1);
        }
    }

    void radf5(int ido, int l1, double[] cc, double[] ch, double[] wtable, int offset) {
        double cr3;
        double ci4;
        double cr2;
        int k;
        double ci5;
        double tr11 = 0.309016994374947;
        double ti11 = 0.951056516295154;
        double tr12 = -0.809016994374947;
        double ti12 = 0.587785252292473;
        int iw1 = offset;
        int iw2 = iw1 + ido;
        int iw3 = iw2 + ido;
        int iw4 = iw3 + ido;
        for (k = 0; k < l1; ++k) {
            cr2 = cc[(k + 4 * l1) * ido] + cc[(k + l1) * ido];
            ci5 = cc[(k + 4 * l1) * ido] - cc[(k + l1) * ido];
            cr3 = cc[(k + 3 * l1) * ido] + cc[(k + 2 * l1) * ido];
            ci4 = cc[(k + 3 * l1) * ido] - cc[(k + 2 * l1) * ido];
            ch[5 * k * ido] = cc[k * ido] + cr2 + cr3;
            ch[ido - 1 + (5 * k + 1) * ido] = cc[k * ido] + 0.309016994374947 * cr2 + -0.809016994374947 * cr3;
            ch[(5 * k + 2) * ido] = 0.951056516295154 * ci5 + 0.587785252292473 * ci4;
            ch[ido - 1 + (5 * k + 3) * ido] = cc[k * ido] + -0.809016994374947 * cr2 + 0.309016994374947 * cr3;
            ch[(5 * k + 4) * ido] = 0.587785252292473 * ci5 - 0.951056516295154 * ci4;
        }
        if (ido == 1) {
            return;
        }
        for (k = 0; k < l1; ++k) {
            for (int i = 2; i < ido; i += 2) {
                int ic = ido - i;
                double dr2 = wtable[i - 2 + iw1] * cc[i - 1 + (k + l1) * ido] + wtable[i - 1 + iw1] * cc[i + (k + l1) * ido];
                double di2 = wtable[i - 2 + iw1] * cc[i + (k + l1) * ido] - wtable[i - 1 + iw1] * cc[i - 1 + (k + l1) * ido];
                double dr3 = wtable[i - 2 + iw2] * cc[i - 1 + (k + 2 * l1) * ido] + wtable[i - 1 + iw2] * cc[i + (k + 2 * l1) * ido];
                double di3 = wtable[i - 2 + iw2] * cc[i + (k + 2 * l1) * ido] - wtable[i - 1 + iw2] * cc[i - 1 + (k + 2 * l1) * ido];
                double dr4 = wtable[i - 2 + iw3] * cc[i - 1 + (k + 3 * l1) * ido] + wtable[i - 1 + iw3] * cc[i + (k + 3 * l1) * ido];
                double di4 = wtable[i - 2 + iw3] * cc[i + (k + 3 * l1) * ido] - wtable[i - 1 + iw3] * cc[i - 1 + (k + 3 * l1) * ido];
                double dr5 = wtable[i - 2 + iw4] * cc[i - 1 + (k + 4 * l1) * ido] + wtable[i - 1 + iw4] * cc[i + (k + 4 * l1) * ido];
                double di5 = wtable[i - 2 + iw4] * cc[i + (k + 4 * l1) * ido] - wtable[i - 1 + iw4] * cc[i - 1 + (k + 4 * l1) * ido];
                cr2 = dr2 + dr5;
                ci5 = dr5 - dr2;
                double cr5 = di2 - di5;
                double ci2 = di2 + di5;
                cr3 = dr3 + dr4;
                ci4 = dr4 - dr3;
                double cr4 = di3 - di4;
                double ci3 = di3 + di4;
                ch[i - 1 + 5 * k * ido] = cc[i - 1 + k * ido] + cr2 + cr3;
                ch[i + 5 * k * ido] = cc[i + k * ido] + ci2 + ci3;
                double tr2 = cc[i - 1 + k * ido] + 0.309016994374947 * cr2 + -0.809016994374947 * cr3;
                double ti2 = cc[i + k * ido] + 0.309016994374947 * ci2 + -0.809016994374947 * ci3;
                double tr3 = cc[i - 1 + k * ido] + -0.809016994374947 * cr2 + 0.309016994374947 * cr3;
                double ti3 = cc[i + k * ido] + -0.809016994374947 * ci2 + 0.309016994374947 * ci3;
                double tr5 = 0.951056516295154 * cr5 + 0.587785252292473 * cr4;
                double ti5 = 0.951056516295154 * ci5 + 0.587785252292473 * ci4;
                double tr4 = 0.587785252292473 * cr5 - 0.951056516295154 * cr4;
                double ti4 = 0.587785252292473 * ci5 - 0.951056516295154 * ci4;
                ch[i - 1 + (5 * k + 2) * ido] = tr2 + tr5;
                ch[ic - 1 + (5 * k + 1) * ido] = tr2 - tr5;
                ch[i + (5 * k + 2) * ido] = ti2 + ti5;
                ch[ic + (5 * k + 1) * ido] = ti5 - ti2;
                ch[i - 1 + (5 * k + 4) * ido] = tr3 + tr4;
                ch[ic - 1 + (5 * k + 3) * ido] = tr3 - tr4;
                ch[i + (5 * k + 4) * ido] = ti3 + ti4;
                ch[ic + (5 * k + 3) * ido] = ti4 - ti3;
            }
        }
    }

    void radb5(int ido, int l1, double[] cc, double[] ch, double[] wtable, int offset) {
        double tr2;
        double ti4;
        double tr3;
        double ti5;
        double cr3;
        double cr2;
        double ci4;
        double ci5;
        int k;
        double tr11 = 0.309016994374947;
        double ti11 = 0.951056516295154;
        double tr12 = -0.809016994374947;
        double ti12 = 0.587785252292473;
        int iw1 = offset;
        int iw2 = iw1 + ido;
        int iw3 = iw2 + ido;
        int iw4 = iw3 + ido;
        for (k = 0; k < l1; ++k) {
            ti5 = 2.0 * cc[(5 * k + 2) * ido];
            ti4 = 2.0 * cc[(5 * k + 4) * ido];
            tr2 = 2.0 * cc[ido - 1 + (5 * k + 1) * ido];
            tr3 = 2.0 * cc[ido - 1 + (5 * k + 3) * ido];
            ch[k * ido] = cc[5 * k * ido] + tr2 + tr3;
            cr2 = cc[5 * k * ido] + 0.309016994374947 * tr2 + -0.809016994374947 * tr3;
            cr3 = cc[5 * k * ido] + -0.809016994374947 * tr2 + 0.309016994374947 * tr3;
            ci5 = 0.951056516295154 * ti5 + 0.587785252292473 * ti4;
            ci4 = 0.587785252292473 * ti5 - 0.951056516295154 * ti4;
            ch[(k + l1) * ido] = cr2 - ci5;
            ch[(k + 2 * l1) * ido] = cr3 - ci4;
            ch[(k + 3 * l1) * ido] = cr3 + ci4;
            ch[(k + 4 * l1) * ido] = cr2 + ci5;
        }
        if (ido == 1) {
            return;
        }
        for (k = 0; k < l1; ++k) {
            for (int i = 2; i < ido; i += 2) {
                int ic = ido - i;
                ti5 = cc[i + (5 * k + 2) * ido] + cc[ic + (5 * k + 1) * ido];
                double ti2 = cc[i + (5 * k + 2) * ido] - cc[ic + (5 * k + 1) * ido];
                ti4 = cc[i + (5 * k + 4) * ido] + cc[ic + (5 * k + 3) * ido];
                double ti3 = cc[i + (5 * k + 4) * ido] - cc[ic + (5 * k + 3) * ido];
                double tr5 = cc[i - 1 + (5 * k + 2) * ido] - cc[ic - 1 + (5 * k + 1) * ido];
                tr2 = cc[i - 1 + (5 * k + 2) * ido] + cc[ic - 1 + (5 * k + 1) * ido];
                double tr4 = cc[i - 1 + (5 * k + 4) * ido] - cc[ic - 1 + (5 * k + 3) * ido];
                tr3 = cc[i - 1 + (5 * k + 4) * ido] + cc[ic - 1 + (5 * k + 3) * ido];
                ch[i - 1 + k * ido] = cc[i - 1 + 5 * k * ido] + tr2 + tr3;
                ch[i + k * ido] = cc[i + 5 * k * ido] + ti2 + ti3;
                cr2 = cc[i - 1 + 5 * k * ido] + 0.309016994374947 * tr2 + -0.809016994374947 * tr3;
                double ci2 = cc[i + 5 * k * ido] + 0.309016994374947 * ti2 + -0.809016994374947 * ti3;
                cr3 = cc[i - 1 + 5 * k * ido] + -0.809016994374947 * tr2 + 0.309016994374947 * tr3;
                double ci3 = cc[i + 5 * k * ido] + -0.809016994374947 * ti2 + 0.309016994374947 * ti3;
                double cr5 = 0.951056516295154 * tr5 + 0.587785252292473 * tr4;
                ci5 = 0.951056516295154 * ti5 + 0.587785252292473 * ti4;
                double cr4 = 0.587785252292473 * tr5 - 0.951056516295154 * tr4;
                ci4 = 0.587785252292473 * ti5 - 0.951056516295154 * ti4;
                double dr3 = cr3 - ci4;
                double dr4 = cr3 + ci4;
                double di3 = ci3 + cr4;
                double di4 = ci3 - cr4;
                double dr5 = cr2 + ci5;
                double dr2 = cr2 - ci5;
                double di5 = ci2 - cr5;
                double di2 = ci2 + cr5;
                ch[i - 1 + (k + l1) * ido] = wtable[i - 2 + iw1] * dr2 - wtable[i - 1 + iw1] * di2;
                ch[i + (k + l1) * ido] = wtable[i - 2 + iw1] * di2 + wtable[i - 1 + iw1] * dr2;
                ch[i - 1 + (k + 2 * l1) * ido] = wtable[i - 2 + iw2] * dr3 - wtable[i - 1 + iw2] * di3;
                ch[i + (k + 2 * l1) * ido] = wtable[i - 2 + iw2] * di3 + wtable[i - 1 + iw2] * dr3;
                ch[i - 1 + (k + 3 * l1) * ido] = wtable[i - 2 + iw3] * dr4 - wtable[i - 1 + iw3] * di4;
                ch[i + (k + 3 * l1) * ido] = wtable[i - 2 + iw3] * di4 + wtable[i - 1 + iw3] * dr4;
                ch[i - 1 + (k + 4 * l1) * ido] = wtable[i - 2 + iw4] * dr5 - wtable[i - 1 + iw4] * di5;
                ch[i + (k + 4 * l1) * ido] = wtable[i - 2 + iw4] * di5 + wtable[i - 1 + iw4] * dr5;
            }
        }
    }

    void radfg(int ido, int ip, int l1, int idl1, double[] cc, double[] c1, double[] c2, double[] ch, double[] ch2, double[] wtable, int offset) {
        int j2;
        int k;
        int j;
        int ik;
        int i;
        int jc;
        double twopi = 6.283185307179586;
        int iw1 = offset;
        double arg = 6.283185307179586 / (double)ip;
        double dcp = Math.cos(arg);
        double dsp = Math.sin(arg);
        int ipph = (ip + 1) / 2;
        int nbd = (ido - 1) / 2;
        if (ido != 1) {
            int idij;
            int is;
            for (ik = 0; ik < idl1; ++ik) {
                ch2[ik] = c2[ik];
            }
            for (j = 1; j < ip; ++j) {
                for (k = 0; k < l1; ++k) {
                    ch[(k + j * l1) * ido] = c1[(k + j * l1) * ido];
                }
            }
            if (nbd <= l1) {
                is = - ido;
                for (j = 1; j < ip; ++j) {
                    idij = (is += ido) - 1;
                    for (i = 2; i < ido; i += 2) {
                        idij += 2;
                        for (k = 0; k < l1; ++k) {
                            ch[i - 1 + (k + j * l1) * ido] = wtable[idij - 1 + iw1] * c1[i - 1 + (k + j * l1) * ido] + wtable[idij + iw1] * c1[i + (k + j * l1) * ido];
                            ch[i + (k + j * l1) * ido] = wtable[idij - 1 + iw1] * c1[i + (k + j * l1) * ido] - wtable[idij + iw1] * c1[i - 1 + (k + j * l1) * ido];
                        }
                    }
                }
            } else {
                is = - ido;
                for (j = 1; j < ip; ++j) {
                    is += ido;
                    for (k = 0; k < l1; ++k) {
                        idij = is - 1;
                        for (i = 2; i < ido; i += 2) {
                            ch[i - 1 + (k + j * l1) * ido] = wtable[idij - 1 + iw1] * c1[i - 1 + (k + j * l1) * ido] + wtable[(idij += 2) + iw1] * c1[i + (k + j * l1) * ido];
                            ch[i + (k + j * l1) * ido] = wtable[idij - 1 + iw1] * c1[i + (k + j * l1) * ido] - wtable[idij + iw1] * c1[i - 1 + (k + j * l1) * ido];
                        }
                    }
                }
            }
            if (nbd >= l1) {
                for (j = 1; j < ipph; ++j) {
                    jc = ip - j;
                    for (k = 0; k < l1; ++k) {
                        for (i = 2; i < ido; i += 2) {
                            c1[i - 1 + (k + j * l1) * ido] = ch[i - 1 + (k + j * l1) * ido] + ch[i - 1 + (k + jc * l1) * ido];
                            c1[i - 1 + (k + jc * l1) * ido] = ch[i + (k + j * l1) * ido] - ch[i + (k + jc * l1) * ido];
                            c1[i + (k + j * l1) * ido] = ch[i + (k + j * l1) * ido] + ch[i + (k + jc * l1) * ido];
                            c1[i + (k + jc * l1) * ido] = ch[i - 1 + (k + jc * l1) * ido] - ch[i - 1 + (k + j * l1) * ido];
                        }
                    }
                }
            } else {
                for (j = 1; j < ipph; ++j) {
                    jc = ip - j;
                    for (i = 2; i < ido; i += 2) {
                        for (k = 0; k < l1; ++k) {
                            c1[i - 1 + (k + j * l1) * ido] = ch[i - 1 + (k + j * l1) * ido] + ch[i - 1 + (k + jc * l1) * ido];
                            c1[i - 1 + (k + jc * l1) * ido] = ch[i + (k + j * l1) * ido] - ch[i + (k + jc * l1) * ido];
                            c1[i + (k + j * l1) * ido] = ch[i + (k + j * l1) * ido] + ch[i + (k + jc * l1) * ido];
                            c1[i + (k + jc * l1) * ido] = ch[i - 1 + (k + jc * l1) * ido] - ch[i - 1 + (k + j * l1) * ido];
                        }
                    }
                }
            }
        } else {
            for (ik = 0; ik < idl1; ++ik) {
                c2[ik] = ch2[ik];
            }
        }
        for (j = 1; j < ipph; ++j) {
            jc = ip - j;
            for (k = 0; k < l1; ++k) {
                c1[(k + j * l1) * ido] = ch[(k + j * l1) * ido] + ch[(k + jc * l1) * ido];
                c1[(k + jc * l1) * ido] = ch[(k + jc * l1) * ido] - ch[(k + j * l1) * ido];
            }
        }
        double ar1 = 1.0;
        double ai1 = 0.0;
        for (int l = 1; l < ipph; ++l) {
            int lc = ip - l;
            double ar1h = dcp * ar1 - dsp * ai1;
            ai1 = dcp * ai1 + dsp * ar1;
            ar1 = ar1h;
            for (ik = 0; ik < idl1; ++ik) {
                ch2[ik + l * idl1] = c2[ik] + ar1 * c2[ik + idl1];
                ch2[ik + lc * idl1] = ai1 * c2[ik + (ip - 1) * idl1];
            }
            double dc2 = ar1;
            double ds2 = ai1;
            double ar2 = ar1;
            double ai2 = ai1;
            for (j = 2; j < ipph; ++j) {
                jc = ip - j;
                double ar2h = dc2 * ar2 - ds2 * ai2;
                ai2 = dc2 * ai2 + ds2 * ar2;
                ar2 = ar2h;
                for (ik = 0; ik < idl1; ++ik) {
                    double[] arrd = ch2;
                    int n = ik + l * idl1;
                    arrd[n] = arrd[n] + ar2 * c2[ik + j * idl1];
                    double[] arrd2 = ch2;
                    int n2 = ik + lc * idl1;
                    arrd2[n2] = arrd2[n2] + ai2 * c2[ik + jc * idl1];
                }
            }
        }
        for (j = 1; j < ipph; ++j) {
            for (ik = 0; ik < idl1; ++ik) {
                double[] arrd = ch2;
                int n = ik;
                arrd[n] = arrd[n] + c2[ik + j * idl1];
            }
        }
        if (ido >= l1) {
            for (k = 0; k < l1; ++k) {
                for (i = 0; i < ido; ++i) {
                    cc[i + k * ip * ido] = ch[i + k * ido];
                }
            }
        } else {
            for (i = 0; i < ido; ++i) {
                for (k = 0; k < l1; ++k) {
                    cc[i + k * ip * ido] = ch[i + k * ido];
                }
            }
        }
        for (j = 1; j < ipph; ++j) {
            jc = ip - j;
            j2 = 2 * j;
            for (k = 0; k < l1; ++k) {
                cc[ido - 1 + (j2 - 1 + k * ip) * ido] = ch[(k + j * l1) * ido];
                cc[(j2 + k * ip) * ido] = ch[(k + jc * l1) * ido];
            }
        }
        if (ido == 1) {
            return;
        }
        if (nbd >= l1) {
            for (j = 1; j < ipph; ++j) {
                jc = ip - j;
                j2 = 2 * j;
                for (k = 0; k < l1; ++k) {
                    for (i = 2; i < ido; i += 2) {
                        int ic = ido - i;
                        cc[i - 1 + (j2 + k * ip) * ido] = ch[i - 1 + (k + j * l1) * ido] + ch[i - 1 + (k + jc * l1) * ido];
                        cc[ic - 1 + (j2 - 1 + k * ip) * ido] = ch[i - 1 + (k + j * l1) * ido] - ch[i - 1 + (k + jc * l1) * ido];
                        cc[i + (j2 + k * ip) * ido] = ch[i + (k + j * l1) * ido] + ch[i + (k + jc * l1) * ido];
                        cc[ic + (j2 - 1 + k * ip) * ido] = ch[i + (k + jc * l1) * ido] - ch[i + (k + j * l1) * ido];
                    }
                }
            }
        } else {
            for (j = 1; j < ipph; ++j) {
                jc = ip - j;
                j2 = 2 * j;
                for (i = 2; i < ido; i += 2) {
                    int ic = ido - i;
                    for (k = 0; k < l1; ++k) {
                        cc[i - 1 + (j2 + k * ip) * ido] = ch[i - 1 + (k + j * l1) * ido] + ch[i - 1 + (k + jc * l1) * ido];
                        cc[ic - 1 + (j2 - 1 + k * ip) * ido] = ch[i - 1 + (k + j * l1) * ido] - ch[i - 1 + (k + jc * l1) * ido];
                        cc[i + (j2 + k * ip) * ido] = ch[i + (k + j * l1) * ido] + ch[i + (k + jc * l1) * ido];
                        cc[ic + (j2 - 1 + k * ip) * ido] = ch[i + (k + jc * l1) * ido] - ch[i + (k + j * l1) * ido];
                    }
                }
            }
        }
    }

    void radbg(int ido, int ip, int l1, int idl1, double[] cc, double[] c1, double[] c2, double[] ch, double[] ch2, double[] wtable, int offset) {
        int ik;
        int k;
        int i;
        int jc;
        int j;
        double twopi = 6.283185307179586;
        int iw1 = offset;
        double arg = 6.283185307179586 / (double)ip;
        double dcp = Math.cos(arg);
        double dsp = Math.sin(arg);
        int nbd = (ido - 1) / 2;
        int ipph = (ip + 1) / 2;
        if (ido >= l1) {
            for (k = 0; k < l1; ++k) {
                for (i = 0; i < ido; ++i) {
                    ch[i + k * ido] = cc[i + k * ip * ido];
                }
            }
        } else {
            for (i = 0; i < ido; ++i) {
                for (k = 0; k < l1; ++k) {
                    ch[i + k * ido] = cc[i + k * ip * ido];
                }
            }
        }
        for (j = 1; j < ipph; ++j) {
            jc = ip - j;
            int j2 = 2 * j;
            for (k = 0; k < l1; ++k) {
                ch[(k + j * l1) * ido] = cc[ido - 1 + (j2 - 1 + k * ip) * ido] + cc[ido - 1 + (j2 - 1 + k * ip) * ido];
                ch[(k + jc * l1) * ido] = cc[(j2 + k * ip) * ido] + cc[(j2 + k * ip) * ido];
            }
        }
        if (ido != 1) {
            int ic;
            if (nbd >= l1) {
                for (j = 1; j < ipph; ++j) {
                    jc = ip - j;
                    for (k = 0; k < l1; ++k) {
                        for (i = 2; i < ido; i += 2) {
                            ic = ido - i;
                            ch[i - 1 + (k + j * l1) * ido] = cc[i - 1 + (2 * j + k * ip) * ido] + cc[ic - 1 + (2 * j - 1 + k * ip) * ido];
                            ch[i - 1 + (k + jc * l1) * ido] = cc[i - 1 + (2 * j + k * ip) * ido] - cc[ic - 1 + (2 * j - 1 + k * ip) * ido];
                            ch[i + (k + j * l1) * ido] = cc[i + (2 * j + k * ip) * ido] - cc[ic + (2 * j - 1 + k * ip) * ido];
                            ch[i + (k + jc * l1) * ido] = cc[i + (2 * j + k * ip) * ido] + cc[ic + (2 * j - 1 + k * ip) * ido];
                        }
                    }
                }
            } else {
                for (j = 1; j < ipph; ++j) {
                    jc = ip - j;
                    for (i = 2; i < ido; i += 2) {
                        ic = ido - i;
                        for (k = 0; k < l1; ++k) {
                            ch[i - 1 + (k + j * l1) * ido] = cc[i - 1 + (2 * j + k * ip) * ido] + cc[ic - 1 + (2 * j - 1 + k * ip) * ido];
                            ch[i - 1 + (k + jc * l1) * ido] = cc[i - 1 + (2 * j + k * ip) * ido] - cc[ic - 1 + (2 * j - 1 + k * ip) * ido];
                            ch[i + (k + j * l1) * ido] = cc[i + (2 * j + k * ip) * ido] - cc[ic + (2 * j - 1 + k * ip) * ido];
                            ch[i + (k + jc * l1) * ido] = cc[i + (2 * j + k * ip) * ido] + cc[ic + (2 * j - 1 + k * ip) * ido];
                        }
                    }
                }
            }
        }
        double ar1 = 1.0;
        double ai1 = 0.0;
        for (int l = 1; l < ipph; ++l) {
            int lc = ip - l;
            double ar1h = dcp * ar1 - dsp * ai1;
            ai1 = dcp * ai1 + dsp * ar1;
            ar1 = ar1h;
            for (ik = 0; ik < idl1; ++ik) {
                c2[ik + l * idl1] = ch2[ik] + ar1 * ch2[ik + idl1];
                c2[ik + lc * idl1] = ai1 * ch2[ik + (ip - 1) * idl1];
            }
            double dc2 = ar1;
            double ds2 = ai1;
            double ar2 = ar1;
            double ai2 = ai1;
            for (j = 2; j < ipph; ++j) {
                jc = ip - j;
                double ar2h = dc2 * ar2 - ds2 * ai2;
                ai2 = dc2 * ai2 + ds2 * ar2;
                ar2 = ar2h;
                for (ik = 0; ik < idl1; ++ik) {
                    double[] arrd = c2;
                    int n = ik + l * idl1;
                    arrd[n] = arrd[n] + ar2 * ch2[ik + j * idl1];
                    double[] arrd2 = c2;
                    int n2 = ik + lc * idl1;
                    arrd2[n2] = arrd2[n2] + ai2 * ch2[ik + jc * idl1];
                }
            }
        }
        for (j = 1; j < ipph; ++j) {
            for (ik = 0; ik < idl1; ++ik) {
                double[] arrd = ch2;
                int n = ik;
                arrd[n] = arrd[n] + ch2[ik + j * idl1];
            }
        }
        for (j = 1; j < ipph; ++j) {
            jc = ip - j;
            for (k = 0; k < l1; ++k) {
                ch[(k + j * l1) * ido] = c1[(k + j * l1) * ido] - c1[(k + jc * l1) * ido];
                ch[(k + jc * l1) * ido] = c1[(k + j * l1) * ido] + c1[(k + jc * l1) * ido];
            }
        }
        if (ido == 1) {
            return;
        }
        if (nbd >= l1) {
            for (j = 1; j < ipph; ++j) {
                jc = ip - j;
                for (k = 0; k < l1; ++k) {
                    for (i = 2; i < ido; i += 2) {
                        ch[i - 1 + (k + j * l1) * ido] = c1[i - 1 + (k + j * l1) * ido] - c1[i + (k + jc * l1) * ido];
                        ch[i - 1 + (k + jc * l1) * ido] = c1[i - 1 + (k + j * l1) * ido] + c1[i + (k + jc * l1) * ido];
                        ch[i + (k + j * l1) * ido] = c1[i + (k + j * l1) * ido] + c1[i - 1 + (k + jc * l1) * ido];
                        ch[i + (k + jc * l1) * ido] = c1[i + (k + j * l1) * ido] - c1[i - 1 + (k + jc * l1) * ido];
                    }
                }
            }
        } else {
            for (j = 1; j < ipph; ++j) {
                jc = ip - j;
                for (i = 2; i < ido; i += 2) {
                    for (k = 0; k < l1; ++k) {
                        ch[i - 1 + (k + j * l1) * ido] = c1[i - 1 + (k + j * l1) * ido] - c1[i + (k + jc * l1) * ido];
                        ch[i - 1 + (k + jc * l1) * ido] = c1[i - 1 + (k + j * l1) * ido] + c1[i + (k + jc * l1) * ido];
                        ch[i + (k + j * l1) * ido] = c1[i + (k + j * l1) * ido] + c1[i - 1 + (k + jc * l1) * ido];
                        ch[i + (k + jc * l1) * ido] = c1[i + (k + j * l1) * ido] - c1[i - 1 + (k + jc * l1) * ido];
                    }
                }
            }
        }
        for (ik = 0; ik < idl1; ++ik) {
            c2[ik] = ch2[ik];
        }
        for (j = 1; j < ip; ++j) {
            for (k = 0; k < l1; ++k) {
                c1[(k + j * l1) * ido] = ch[(k + j * l1) * ido];
            }
        }
        if (nbd <= l1) {
            int is = - ido;
            for (j = 1; j < ip; ++j) {
                int idij = (is += ido) - 1;
                for (i = 2; i < ido; i += 2) {
                    idij += 2;
                    for (k = 0; k < l1; ++k) {
                        c1[i - 1 + (k + j * l1) * ido] = wtable[idij - 1 + iw1] * ch[i - 1 + (k + j * l1) * ido] - wtable[idij + iw1] * ch[i + (k + j * l1) * ido];
                        c1[i + (k + j * l1) * ido] = wtable[idij - 1 + iw1] * ch[i + (k + j * l1) * ido] + wtable[idij + iw1] * ch[i - 1 + (k + j * l1) * ido];
                    }
                }
            }
        } else {
            int is = - ido;
            for (j = 1; j < ip; ++j) {
                is += ido;
                for (k = 0; k < l1; ++k) {
                    int idij = is - 1;
                    for (i = 2; i < ido; i += 2) {
                        c1[i - 1 + (k + j * l1) * ido] = wtable[idij - 1 + iw1] * ch[i - 1 + (k + j * l1) * ido] - wtable[(idij += 2) + iw1] * ch[i + (k + j * l1) * ido];
                        c1[i + (k + j * l1) * ido] = wtable[idij - 1 + iw1] * ch[i + (k + j * l1) * ido] + wtable[idij + iw1] * ch[i - 1 + (k + j * l1) * ido];
                    }
                }
            }
        }
    }

    void rfftf1(int n, double[] c, double[] wtable, int offset) {
        double[] ch = new double[n];
        System.arraycopy(wtable, offset, ch, 0, n);
        int nf = (int)wtable[1 + 2 * n + offset];
        int na = 1;
        int l2 = n;
        int iw = n - 1 + n + offset;
        for (int k1 = 1; k1 <= nf; ++k1) {
            int kh = nf - k1;
            int ip = (int)wtable[kh + 2 + 2 * n + offset];
            int l1 = l2 / ip;
            int ido = n / l2;
            int idl1 = ido * l1;
            iw -= (ip - 1) * ido;
            na = 1 - na;
            if (ip == 4) {
                if (na == 0) {
                    this.radf4(ido, l1, c, ch, wtable, iw);
                } else {
                    this.radf4(ido, l1, ch, c, wtable, iw);
                }
            } else if (ip == 2) {
                if (na == 0) {
                    this.radf2(ido, l1, c, ch, wtable, iw);
                } else {
                    this.radf2(ido, l1, ch, c, wtable, iw);
                }
            } else if (ip == 3) {
                if (na == 0) {
                    this.radf3(ido, l1, c, ch, wtable, iw);
                } else {
                    this.radf3(ido, l1, ch, c, wtable, iw);
                }
            } else if (ip == 5) {
                if (na == 0) {
                    this.radf5(ido, l1, c, ch, wtable, iw);
                } else {
                    this.radf5(ido, l1, ch, c, wtable, iw);
                }
            } else {
                if (ido == 1) {
                    na = 1 - na;
                }
                if (na == 0) {
                    this.radfg(ido, ip, l1, idl1, c, c, c, ch, ch, wtable, iw);
                    na = 1;
                } else {
                    this.radfg(ido, ip, l1, idl1, ch, ch, ch, c, c, wtable, iw);
                    na = 0;
                }
            }
            l2 = l1;
        }
        if (na == 1) {
            return;
        }
        for (int i = 0; i < n; ++i) {
            c[i] = ch[i];
        }
    }

    void rfftb1(int n, double[] c, double[] wtable, int offset) {
        double[] ch = new double[n];
        System.arraycopy(wtable, offset, ch, 0, n);
        int nf = (int)wtable[1 + 2 * n + offset];
        int na = 0;
        int l1 = 1;
        int iw = n + offset;
        for (int k1 = 1; k1 <= nf; ++k1) {
            int ip = (int)wtable[k1 + 1 + 2 * n + offset];
            int l2 = ip * l1;
            int ido = n / l2;
            int idl1 = ido * l1;
            if (ip == 4) {
                if (na == 0) {
                    this.radb4(ido, l1, c, ch, wtable, iw);
                } else {
                    this.radb4(ido, l1, ch, c, wtable, iw);
                }
                na = 1 - na;
            } else if (ip == 2) {
                if (na == 0) {
                    this.radb2(ido, l1, c, ch, wtable, iw);
                } else {
                    this.radb2(ido, l1, ch, c, wtable, iw);
                }
                na = 1 - na;
            } else if (ip == 3) {
                if (na == 0) {
                    this.radb3(ido, l1, c, ch, wtable, iw);
                } else {
                    this.radb3(ido, l1, ch, c, wtable, iw);
                }
                na = 1 - na;
            } else if (ip == 5) {
                if (na == 0) {
                    this.radb5(ido, l1, c, ch, wtable, iw);
                } else {
                    this.radb5(ido, l1, ch, c, wtable, iw);
                }
                na = 1 - na;
            } else {
                if (na == 0) {
                    this.radbg(ido, ip, l1, idl1, c, c, c, ch, ch, wtable, iw);
                } else {
                    this.radbg(ido, ip, l1, idl1, ch, ch, ch, c, c, wtable, iw);
                }
                if (ido == 1) {
                    na = 1 - na;
                }
            }
            l1 = l2;
            iw += (ip - 1) * ido;
        }
        if (na == 0) {
            return;
        }
        for (int i = 0; i < n; ++i) {
            c[i] = ch[i];
        }
    }

    void rfftf(int n, double[] r, double[] wtable) {
        if (n == 1) {
            return;
        }
        this.rfftf1(n, r, wtable, 0);
    }

    void rfftb(int n, double[] r, double[] wtable) {
        if (n == 1) {
            return;
        }
        this.rfftb1(n, r, wtable, 0);
    }

    void rffti1(int n, double[] wtable, int offset) {
        int i;
        int[] ntryh = new int[]{4, 2, 3, 5};
        double twopi = 6.283185307179586;
        int ntry = 0;
        int nl = n;
        int nf = 0;
        int j = 0;
        block0 : do {
            ntry = ++j <= 4 ? ntryh[j - 1] : (ntry += 2);
            do {
                int nr;
                int nq;
                if ((nr = nl - ntry * (nq = nl / ntry)) != 0) continue block0;
                wtable[++nf + 1 + 2 * n + offset] = ntry;
                nl = nq;
                if (ntry != 2 || nf == 1) continue;
                for (i = 2; i <= nf; ++i) {
                    int ib = nf - i + 2;
                    wtable[ib + 1 + 2 * n + offset] = wtable[ib + 2 * n + offset];
                }
                wtable[2 + 2 * n + offset] = 2.0;
            } while (nl != 1);
            break;
        } while (true);
        wtable[0 + 2 * n + offset] = n;
        wtable[1 + 2 * n + offset] = nf;
        double argh = 6.283185307179586 / (double)n;
        int is = 0;
        int nfm1 = nf - 1;
        int l1 = 1;
        if (nfm1 == 0) {
            return;
        }
        for (int k1 = 1; k1 <= nfm1; ++k1) {
            int ip = (int)wtable[k1 + 1 + 2 * n + offset];
            int ld = 0;
            int l2 = l1 * ip;
            int ido = n / l2;
            int ipm = ip - 1;
            for (j = 1; j <= ipm; ++j) {
                i = is;
                double argld = (double)(ld += l1) * argh;
                double fi = 0.0;
                for (int ii = 3; ii <= ido; ii += 2) {
                    double arg = (fi += 1.0) * argld;
                    wtable[(i += 2) - 2 + n + offset] = Math.cos(arg);
                    wtable[i - 1 + n + offset] = Math.sin(arg);
                }
                is += ido;
            }
            l1 = l2;
        }
    }

    void rffti(int n, double[] wtable) {
        if (n == 1) {
            return;
        }
        this.rffti1(n, wtable, 0);
    }
}

